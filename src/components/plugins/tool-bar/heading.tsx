'use client'

import { $getSelection, LexicalEditor } from 'lexical'
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { Select, SelectItem } from '@nextui-org/react'
import { ChangeEvent } from 'react'

const headingTags: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

function Heading({ editor }: { editor: LexicalEditor }) {
	const handleHeadingChange = (e: ChangeEvent<HTMLSelectElement>) => {
		editor.update(() => {
			const selection = $getSelection()
			$setBlocksType(selection, () => $createHeadingNode(e.target.value as HeadingTagType))
		})
	}

	return (
		<Select onChange={handleHeadingChange} radius="none" className="inline-block">
			{headingTags.map((heading) => (
				<SelectItem key={heading} value={heading}>
					{heading}
				</SelectItem>
			))}
		</Select>
	)
}

export default Heading
