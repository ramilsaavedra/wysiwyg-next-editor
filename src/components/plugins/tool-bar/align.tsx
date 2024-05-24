import { Select, SelectItem } from '@nextui-org/react'
import { ElementFormatType, FORMAT_ELEMENT_COMMAND, LexicalEditor } from 'lexical'
import { ChangeEvent } from 'react'

interface AlignProps {
	editor: LexicalEditor
	align: ElementFormatType
}

function Align({ editor, align }: AlignProps) {
	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		switch (e.target.value as ElementFormatType) {
			case 'left':
				formatLeft()
				return
			case 'center':
				formatCenter()
				return
			case 'right':
				formatRight()
				return
			default:
				return
		}
	}

	const formatLeft = () => {
		editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
	}

	const formatCenter = () => {
		editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
	}

	const formatRight = () => {
		editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
	}

	return (
		<Select onChange={handleSelectChange} radius="none" selectedKeys={[align]} placeholder="Align">
			<SelectItem key="left" value="left">
				Left Align
			</SelectItem>
			<SelectItem key="center" value="center">
				Center Align
			</SelectItem>
			<SelectItem key="right" value="right">
				Right Align
			</SelectItem>
		</Select>
	)
}

export default Align
