'use client'

import { $getSelection, LexicalEditor } from 'lexical'
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { Select, SelectItem } from '@nextui-org/react'
import { ChangeEvent } from 'react'

const headingTags: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

interface HeadingProps {
	editor: LexicalEditor
}

function Heading({ editor }: HeadingProps) {
	const handleHeadingChange = (e: ChangeEvent<HTMLSelectElement>) => {
		editor.update(() => {
			const selection = $getSelection()
			console.log(getSele)
			if (!selection) {
				return
			}
			$setBlocksType(selection, () => $createHeadingNode(e.target.value as HeadingTagType))
		})
	}

	return (
		<Select onChange={handleHeadingChange} radius="none" className="inline-block">
			{/* {
				<SelectItem key="normal" value="normal">
					Normal
				</SelectItem>
			} */}
			{headingTags.map((heading) => (
				<SelectItem key={heading} value={heading} className="capitalize">
					{heading}
				</SelectItem>
			))}
		</Select>
	)
}

export default Heading
