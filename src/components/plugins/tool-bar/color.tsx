'use client'

import ColorPicker from '@/components/common/color-picker'
import useDebounce from '@/hooks/useDebounce'
import { useState } from 'react'

interface ColorProps {
	color: string
	onChange: (x: string, y: boolean) => void
}

function Color({ color, onChange }: ColorProps) {
	const [inputColor, setInputColor] = useState(color)

	useDebounce(() => onChange(inputColor, false), 200, [inputColor])

	return (
		<ColorPicker value={inputColor} onChange={setInputColor} id="font-color">
			<span className="font-bold pointer-events-none select-none">A</span>
		</ColorPicker>
	)
}

export default Color
