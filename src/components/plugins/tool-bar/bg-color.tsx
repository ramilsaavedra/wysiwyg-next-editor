import { useState } from 'react'
import ColorPicker from '@/components/common/color-picker'
import useDebounce from '@/hooks/useDebounce'

interface BGColorProps {
	color: string
	onChange: (x: string, y: boolean) => void
}

function BGColor({ color, onChange }: BGColorProps) {
	const [inputColor, setInputColor] = useState(color)

	useDebounce(() => onChange(inputColor, false), 200, [inputColor])

	return (
		<ColorPicker value={inputColor} onChange={setInputColor} id="bg-color">
			<span className="font-bold pointer-events-none select-none">BG</span>
		</ColorPicker>
	)
}

export default BGColor
