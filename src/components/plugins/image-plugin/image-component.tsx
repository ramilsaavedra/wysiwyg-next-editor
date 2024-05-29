import type { Position } from './image-node'
import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	DRAGSTART_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_ESCAPE_COMMAND,
	SELECTION_CHANGE_COMMAND,
} from 'lexical'
import * as React from 'react'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { $isInlineImageNode } from './image-node'
import { cn } from '@nextui-org/react'

const imageCache = new Set()

function useSuspenseImage(src: string) {
	if (!imageCache.has(src)) {
		throw new Promise((resolve) => {
			const img = new Image()
			img.src = src
			img.onload = () => {
				imageCache.add(src)
				resolve(null)
			}
		})
	}
}

function LazyImage({
	altText,
	className,
	imageRef,
	src,
	width,
	height,
	position,
}: {
	altText: string
	className: string | null
	height: 'inherit' | number
	imageRef: { current: null | HTMLImageElement }
	src: string
	width: 'inherit' | number
	position: Position
}): JSX.Element {
	useSuspenseImage(src)
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={className || undefined}
			src={src}
			alt={altText}
			ref={imageRef}
			data-position={position}
			style={{
				display: 'block',
				height,
				width,
			}}
			draggable="false"
		/>
	)
}

interface InlineImageComponentProps {
	altText: string
	height: 'inherit' | number
	nodeKey: NodeKey
	src: string
	width: 'inherit' | number
	position: Position
}

export default function InlineImageComponent({ src, altText, nodeKey, width, height, position }: InlineImageComponentProps): JSX.Element {
	const imageRef = useRef<null | HTMLImageElement>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
	const [editor] = useLexicalComposerContext()
	const [selection, setSelection] = useState<BaseSelection | null>(null)
	const activeEditorRef = useRef<LexicalEditor | null>(null)

	const $onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && $isNodeSelection($getSelection())) {
				const event: KeyboardEvent = payload
				event.preventDefault()
				const node = $getNodeByKey(nodeKey)
				if ($isInlineImageNode(node)) {
					node.remove()
					return true
				}
			}
			return false
		},
		[isSelected, nodeKey]
	)

	const $onEnter = useCallback(
		(event: KeyboardEvent) => {
			const latestSelection = $getSelection()
			const buttonElem = buttonRef.current
			if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
				if (buttonElem !== null && buttonElem !== document.activeElement) {
					event.preventDefault()
					buttonElem.focus()
					return true
				}
			}
			return false
		},
		[isSelected]
	)

	const $onEscape = useCallback(
		(event: KeyboardEvent) => {
			if (buttonRef.current === event.target) {
				$setSelection(null)
				editor.update(() => {
					setSelected(true)
					const parentRootElement = editor.getRootElement()
					if (parentRootElement !== null) {
						parentRootElement.focus()
					}
				})
				return true
			}
			return false
		},
		[editor, setSelected]
	)

	useEffect(() => {
		let isMounted = true
		const unregister = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				if (isMounted) {
					setSelection(editorState.read(() => $getSelection()))
				}
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, activeEditor) => {
					activeEditorRef.current = activeEditor
					return false
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand<MouseEvent>(
				CLICK_COMMAND,
				(payload) => {
					const event = payload
					if (event.target === imageRef.current) {
						if (event.shiftKey) {
							setSelected(!isSelected)
						} else {
							clearSelection()
							setSelected(true)
						}
						return true
					}

					return false
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				(event) => {
					if (event.target === imageRef.current) {
						// TODO This is just a temporary workaround for FF to behave like other browsers.
						// Ideally, this handles drag & drop too (and all browsers).
						event.preventDefault()
						return true
					}
					return false
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_BACKSPACE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW)
		)
		return () => {
			isMounted = false
			unregister()
		}
	}, [clearSelection, editor, isSelected, nodeKey, $onDelete, $onEnter, $onEscape, setSelected])

	const draggable = isSelected && $isNodeSelection(selection)
	const isFocused = isSelected
	return (
		<Suspense fallback={null}>
			<LazyImage
				className={cn('box-boder border-2', isFocused ? `border-blue-700 ${$isNodeSelection(selection) ? 'draggable' : null}` : null)}
				src={src}
				altText={altText}
				imageRef={imageRef}
				width={width}
				height={height}
				position={position}
			/>
		</Suspense>
	)
}
