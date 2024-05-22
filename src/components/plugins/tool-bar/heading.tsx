'use client'

import { $createParagraphNode, LexicalEditor, $getSelection, $isRangeSelection } from 'lexical'
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'
import { $setBlocksType } from '@lexical/selection'
import { Select, SelectItem } from '@nextui-org/react'
import { blockTypeToBlockName, rootTypeToRootName } from '.'
import { ChangeEvent } from 'react'

interface HeadingProps {
	editor: LexicalEditor
	blockType: keyof typeof blockTypeToBlockName
	rootType: keyof typeof rootTypeToRootName
	disabled?: boolean
}

function Heading({ editor, blockType, rootType, disabled }: HeadingProps) {
	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		switch (e.target?.value as typeof blockType) {
			case 'paragraph':
				formatParagraph()
				return
			case 'h1':
				formatHeading('h1')
				return
			case 'h2':
				formatHeading('h2')
				return
			case 'h3':
				formatHeading('h3')
				return
			case 'h4':
				formatHeading('h4')
				return
			case 'h5':
				formatHeading('h5')
				return
			case 'h6':
				formatHeading('h6')
				return
			case 'bullet':
				formatBulletList()
				return
			// case 'check':
			// 	formatCheckList()
			// 	return
			case 'number':
				formatNumberedList()
				return
			// case 'quote':
			// 	formatQuote()
			// 	return
			// case 'code':
			// 	formatCode()
			// 	return
			default:
				return
		}
	}

	const formatParagraph = () => {
		editor.update(() => {
			const selection = $getSelection()
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode())
			}
		})
	}

	const formatHeading = (headingSize: HeadingTagType) => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection()
				$setBlocksType(selection, () => $createHeadingNode(headingSize))
			})
		}
	}

	const formatBulletList = () => {
		if (blockType !== 'bullet') {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
		} else {
			formatParagraph()
		}
	}

	const formatCheckList = () => {
		if (blockType !== 'check') {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
		} else {
			formatParagraph()
		}
	}

	const formatNumberedList = () => {
		if (blockType !== 'number') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
		} else {
			formatParagraph()
		}
	}

	const formatQuote = () => {
		if (blockType !== 'quote') {
			editor.update(() => {
				const selection = $getSelection()
				$setBlocksType(selection, () => $createQuoteNode())
			})
		}
	}

	const formatCode = () => {
		if (blockType !== 'code') {
			editor.update(() => {
				let selection = $getSelection()

				if (selection !== null) {
					if (selection.isCollapsed()) {
						$setBlocksType(selection, () => $createCodeNode())
					} else {
						const textContent = selection.getTextContent()
						const codeNode = $createCodeNode()
						selection.insertNodes([codeNode])
						selection = $getSelection()
						if ($isRangeSelection(selection)) {
							selection.insertRawText(textContent)
						}
					}
				}
			})
		}
	}

	return (
		<Select onChange={handleSelectChange} radius="none" className="inline-block" selectedKeys={[blockType]}>
			<SelectItem key="paragraph" value="paragraph">
				Normal
			</SelectItem>
			<SelectItem key="h1" value="h1">
				Heading 1
			</SelectItem>
			<SelectItem key="h2" value="h2">
				Heading 2
			</SelectItem>
			<SelectItem key="h3" value="h3">
				Heading 3
			</SelectItem>
			<SelectItem key="h4" value="h4">
				Heading 4
			</SelectItem>
			<SelectItem key="h5" value="h5">
				Heading 5
			</SelectItem>
			<SelectItem key="h6" value="h6">
				Heading 6
			</SelectItem>
			<SelectItem key="bullet" value="bullet">
				Bullet List
			</SelectItem>
			{/* <SelectItem key="check" value="check">
				Check List
			</SelectItem> */}
			<SelectItem key="number" value="number">
				Number List
			</SelectItem>
			{/* <SelectItem key="quote" value="quote">
				Quote
			</SelectItem>
			<SelectItem key="code" value="code">
				Code Block
			</SelectItem> */}
		</Select>
	)
}

export default Heading
