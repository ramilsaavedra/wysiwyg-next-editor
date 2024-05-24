const basicColors = ['#A0153E', '#5D0E41', '#00224D', '#000000', '#444444', '#333333', '#666666', '#00FFFFFF']

interface ColorPickerProps {
	id: string
	value: string
	children: React.ReactNode
	onChange: (e: string) => void
}

function ColorPicker({ id, value, onChange, children }: ColorPickerProps) {
	return (
		<label htmlFor={id} className="select-none">
			<div className="relative h-10 w-10 flex items-center justify-center border bg-gray-200">
				{children}
				<input
					list="colors"
					type="color"
					className="border-none outline-none absolute left-[calc(50%-9px)] bottom-1"
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
			<datalist id="colors">
				{basicColors.map((cl) => (
					<option key={cl}>{cl}</option>
				))}
			</datalist>
		</label>
	)
}

export default ColorPicker
