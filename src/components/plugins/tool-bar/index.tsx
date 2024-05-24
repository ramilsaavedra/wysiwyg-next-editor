'use client'

import { useCallback, useState, useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $isTableNode, $isTableSelection } from '@lexical/table'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isCodeNode, CODE_LANGUAGE_MAP } from '@lexical/code'
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText } from '@lexical/selection'
import { $findMatchingParent, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text'
import { $isListNode, ListNode } from '@lexical/list'
import {
	$createParagraphNode,
	$getNodeByKey,
	$getSelection,
	$isElementNode,
	$isRangeSelection,
	$isRootOrShadowRoot,
	$isTextNode,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_NORMAL,
	ElementFormatType,
	KEY_MODIFIER_COMMAND,
	NodeKey,
	SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { getSelectedNode } from '../utils/get-selected-node'
import { sanitizeUrl } from '../utils/sanitize-url'
// UI Components
import Heading from './heading'
import UndoRedo from './undo-redo'
import FormatToolBar from './format'
import Format from './format'
import Align from './align'
import Size from './size'
import Color from './color'
import BGColor from './bg-color'
import Insert from './insert'
import InsertImageModal from '@/components/common/insert-image-modal'

interface ToolBarPlugin {
	setIsLinkEditMode: (bool: boolean) => void
}

export const blockTypeToBlockName = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote',
}

export const rootTypeToRootName = {
	root: 'Root',
	table: 'Table',
}

function ToolBarPlugin({ setIsLinkEditMode }: ToolBarPlugin) {
	const [editor] = useLexicalComposerContext()
	const [activeEditor, setActiveEditor] = useState(editor)
	const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
	const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root')
	const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null)
	const [fontSize, setFontSize] = useState<string>('15px')
	const [fontColor, setFontColor] = useState<string>('#000')
	const [bgColor, setBgColor] = useState<string>('#fff')
	const [elementFormat, setElementFormat] = useState<ElementFormatType>('left')
	const [isLink, setIsLink] = useState(false)
	const [isBold, setIsBold] = useState(false)
	const [isItalic, setIsItalic] = useState(false)
	const [isUnderline, setIsUnderline] = useState(false)
	const [isStrikethrough, setIsStrikethrough] = useState(false)
	const [canUndo, setCanUndo] = useState(false)
	const [canRedo, setCanRedo] = useState(false)

	const $updateToolbar = useCallback(() => {
		const selection = $getSelection()
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode()
			let element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent()
							return parent !== null && $isRootOrShadowRoot(parent)
					  })

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow()
			}

			const elementKey = element.getKey()
			const elementDOM = activeEditor.getElementByKey(elementKey)

			// Update text format
			setIsBold(selection.hasFormat('bold'))
			setIsItalic(selection.hasFormat('italic'))
			setIsUnderline(selection.hasFormat('underline'))
			setIsStrikethrough(selection.hasFormat('strikethrough'))

			// Update links
			const node = getSelectedNode(selection)
			const parent = node.getParent()
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true)
			} else {
				setIsLink(false)
			}

			const tableNode = $findMatchingParent(node, $isTableNode)
			if ($isTableNode(tableNode)) {
				setRootType('table')
			} else {
				setRootType('root')
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey)
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
					const type = parentList ? parentList.getListType() : element.getListType()
					setBlockType(type)
				} else {
					const type = $isHeadingNode(element) ? element.getTag() : element.getType()
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName)
					}
				}
			}
			// Handle buttons
			setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000000'))
			setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'))
			let matchingParent
			if ($isLinkNode(parent)) {
				// If node is a link, we need to fetch the parent paragraph node to set format
				matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline())
			}

			// If matchingParent is a valid node, pass it's format type
			setElementFormat(
				$isElementNode(matchingParent)
					? matchingParent.getFormatType()
					: $isElementNode(node)
					? node.getFormatType()
					: parent?.getFormatType() || 'left'
			)
		}
		if ($isRangeSelection(selection) || $isTableSelection(selection)) {
			setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'))
		}
	}, [activeEditor])

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				$updateToolbar()
				setActiveEditor(newEditor)
				return false
			},
			COMMAND_PRIORITY_CRITICAL
		)
	}, [editor, $updateToolbar])

	useEffect(() => {
		return mergeRegister(
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateToolbar()
				})
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload)
					return false
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload)
					return false
				},
				COMMAND_PRIORITY_CRITICAL
			)
		)
	}, [$updateToolbar, activeEditor, editor])

	const applyStyleText = useCallback(
		(styles: Record<string, string>, skipHistoryStack?: boolean) => {
			activeEditor.update(
				() => {
					const selection = $getSelection()
					if (selection !== null) {
						$patchStyleText(selection, styles)
					}
				},
				skipHistoryStack ? { tag: 'historic' } : {}
			)
		},
		[activeEditor]
	)

	const onFontColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ color: value }, skipHistoryStack)
		},
		[applyStyleText]
	)

	const onBgColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ 'background-color': value }, skipHistoryStack)
		},
		[applyStyleText]
	)

	const insertLink = useCallback(() => {
		if (!isLink) {
			setIsLinkEditMode(true)
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
		} else {
			setIsLinkEditMode(false)
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
		}
	}, [editor, isLink, setIsLinkEditMode])

	const onCodeLanguageSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey)
					if ($isCodeNode(node)) {
						node.setLanguage(value)
					}
				}
			})
		},
		[activeEditor, selectedElementKey]
	)

	// const insertGifOnClick = (payload: InsertImage) => {
	// 	activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
	// }

	return (
		<div className="w-[50%] mx-auto flex">
			<UndoRedo editor={activeEditor} canUndo={canUndo} canRedo={canRedo} />
			<Heading editor={activeEditor} blockType={blockType} rootType={rootType} />
			<Size editor={activeEditor} fontSize={fontSize} />
			<Format editor={activeEditor} isBold={isBold} isItalic={isItalic} isUnderline={isUnderline} isStrikethrough={isStrikethrough} />
			<Color color={fontColor} onChange={onFontColorSelect} />
			<BGColor color={bgColor} onChange={onBgColorSelect} />
			<Align editor={activeEditor} align={elementFormat} />
			<Insert editor={activeEditor} />
		</div>
	)
}

export default ToolBarPlugin
