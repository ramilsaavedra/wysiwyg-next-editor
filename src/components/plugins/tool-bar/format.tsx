import FormatCheckbox from '@/components/common/format-checkbox'
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical'

interface FormatProps {
	editor: LexicalEditor
	isBold: boolean
	isItalic: boolean
	isUnderline: boolean
	isStrikethrough: boolean
}

function Format({ editor, isBold, isItalic, isUnderline, isStrikethrough }: FormatProps) {
	const formatBold = () => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
	}

	const formatItalic = () => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
	}

	const formatUnderline = () => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
	}

	const formatStrikethrough = () => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
	}
	return (
		<div className="flex">
			<FormatCheckbox isSelected={isBold} onValueChange={formatBold}>
				<span className="font-bold">B</span>
			</FormatCheckbox>
			<FormatCheckbox isSelected={isItalic} onValueChange={formatItalic}>
				<span className="italic">I</span>
			</FormatCheckbox>
			<FormatCheckbox isSelected={isUnderline} onValueChange={formatUnderline}>
				<span className="underline underline-offset-1">U</span>
			</FormatCheckbox>
			<FormatCheckbox isSelected={isStrikethrough} onValueChange={formatStrikethrough}>
				<span className="line-through">S</span>
			</FormatCheckbox>
		</div>
	)
}

export default Format
