/* eslint-disable react-hooks/rules-of-hooks */
import { $getNodeByKey, LexicalEditor, NodeKey } from 'lexical'
import { InlineImageNode, Position } from '../plugins/image-plugin/image-node'
import { useState } from 'react'

export function updateImageModal({ activeEditor, nodeKey }: { activeEditor: LexicalEditor; nodeKey: NodeKey }): JSX.Element {
	const editorState = activeEditor.getEditorState()
	const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode)
	const [altText, setAltText] = useState<string>(node.getAltText())
	const [position, setPosition] = useState<Position>(node.getPosition())

	const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPosition(e.target.value as Position)
	}

	return (
		<>
			<div className="grid grid-cols-[auto,1fr] gap-5">
				<label htmlFor="alt-text" className="my-auto">
					Alt text
				</label>
				<input
					type="text"
					id="alt-text"
					className="border border-gray-900 px-3 py-2 rounded-md"
					value={altText}
					onChange={(e) => setAltText(e.target.value)}
				/>
			</div>
		</>
	)
}
