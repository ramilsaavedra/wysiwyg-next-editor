import type { Position } from './image-node'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { $createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical'
import { useEffect } from 'react'

export const CAN_USE_DOM: boolean =
	typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined'

import { $createInlineImageNode, InlineImageNode, InlineImagePayload } from './image-node'

export type InsertInlineImagePayload = Readonly<InlineImagePayload>

const getDOMSelection = (targetWindow: Window | null): Selection | null => (CAN_USE_DOM ? (targetWindow || window).getSelection() : null)

export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> = createCommand('INSERT_INLINE_IMAGE_COMMAND')

export default function InlineImagePlugin(): JSX.Element | null {
	const [editor] = useLexicalComposerContext()

	useEffect(() => {
		if (!editor.hasNodes([InlineImageNode])) {
			throw new Error('ImagesPlugin: ImageNode not registered on editor')
		}

		return mergeRegister(
			editor.registerCommand<InsertInlineImagePayload>(
				INSERT_INLINE_IMAGE_COMMAND,
				(payload) => {
					const imageNode = $createInlineImageNode(payload)
					$insertNodes([imageNode])
					if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
						$wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
					}

					return true
				},
				COMMAND_PRIORITY_EDITOR
			)
		)
	}, [editor])

	return null
}
