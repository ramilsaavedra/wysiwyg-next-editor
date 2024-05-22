import { useCheckbox, tv, VisuallyHidden, cn } from '@nextui-org/react'

interface FormatCheckboxProps {
	children: React.ReactNode
	isSelected: boolean
	onValueChange: () => void
}

function FormatCheckbox({ children, isSelected, onValueChange }: FormatCheckboxProps) {
	const { getBaseProps, getInputProps } = useCheckbox({
		isSelected,
		onValueChange,
	})

	return (
		<label {...getBaseProps()}>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<div
				className={cn(
					'rounded-none border h-10 w-10 flex items-center justify-center',
					isSelected ? 'bg-gray-400 text-black' : 'text-gray-600 bg-gray-200'
				)}
			>
				{children}
			</div>
		</label>
	)
}

export default FormatCheckbox
