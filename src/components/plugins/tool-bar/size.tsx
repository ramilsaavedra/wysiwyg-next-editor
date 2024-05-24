import { useCallback, useEffect, useState } from 'react'
import { Button, cn } from '@nextui-org/react'
import { $getSelection, LexicalEditor } from 'lexical'
import { $patchStyleText } from '@lexical/selection'

enum updateFontSizeType {
	increment = 1,
	decrement,
}

const MIN_ALLOWED_FONT_SIZE = 8
const MAX_ALLOWED_FONT_SIZE = 150
const DEFAULT_FONT_SIZE = 15

interface SizeProps {
	editor: LexicalEditor
	fontSize: string
}

function Size({ editor, fontSize }: SizeProps) {
	const [inputValue, setInputValue] = useState<number>(DEFAULT_FONT_SIZE)
	const [inputChangeFlag, setInputChangeFlag] = useState<boolean>(false)

	const calculateNextFontSize = (currentFontSize: number, updateType: updateFontSizeType | null) => {
		if (!updateType) {
			return currentFontSize
		}

		let updatedFontSize: number = currentFontSize
		switch (updateType) {
			case updateFontSizeType.decrement:
				switch (true) {
					case currentFontSize > MAX_ALLOWED_FONT_SIZE:
						updatedFontSize = MAX_ALLOWED_FONT_SIZE
						break
					case currentFontSize >= 48:
						updatedFontSize -= 12
						break
					case currentFontSize >= 24:
						updatedFontSize -= 4
						break
					case currentFontSize >= 14:
						updatedFontSize -= 2
						break
					case currentFontSize >= 9:
						updatedFontSize -= 1
						break
					default:
						updatedFontSize = MIN_ALLOWED_FONT_SIZE
						break
				}
				break

			case updateFontSizeType.increment:
				switch (true) {
					case currentFontSize < MIN_ALLOWED_FONT_SIZE:
						updatedFontSize = MIN_ALLOWED_FONT_SIZE
						break
					case currentFontSize < 12:
						updatedFontSize += 1
						break
					case currentFontSize < 20:
						updatedFontSize += 2
						break
					case currentFontSize < 36:
						updatedFontSize += 4
						break
					case currentFontSize <= 110:
						updatedFontSize += 12
						break
					default:
						updatedFontSize = MAX_ALLOWED_FONT_SIZE
						break
				}
				break

			default:
				break
		}
		return updatedFontSize
	}

	const updateFontSizeInSelection = useCallback(
		(newFontSize: string | null, updateType: updateFontSizeType | null) => {
			const getNextFontSize = (prevFontSize: string | null): string => {
				if (!prevFontSize) {
					prevFontSize = `${DEFAULT_FONT_SIZE}px`
				}
				prevFontSize = prevFontSize.slice(0, -2)
				const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType)
				return `${nextFontSize}px`
			}

			editor.update(() => {
				if (editor.isEditable()) {
					const selection = $getSelection()
					if (selection !== null) {
						$patchStyleText(selection, {
							'font-size': newFontSize || getNextFontSize,
						})
					}
				}
			})
		},
		[editor]
	)

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValue)) {
			e.preventDefault()
			setInputValue(DEFAULT_FONT_SIZE)
			return
		}
		setInputChangeFlag(true)
		if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
			e.preventDefault()
			updateFontSizeByInputValue(inputValue)
		}
	}

	const handleInputBlur = () => {
		if (inputChangeFlag) {
			updateFontSizeByInputValue(inputValue)
		}
	}

	const handleButtonClick = (updateType: updateFontSizeType) => {
		if (inputValue) {
			const nextFontSize = calculateNextFontSize(inputValue, updateType)
			updateFontSizeInSelection(String(nextFontSize) + 'px', null)
		} else {
			updateFontSizeInSelection(null, updateType)
		}
	}

	const updateFontSizeByInputValue = (inputValueNumber: number) => {
		let updatedFontSize = inputValueNumber
		if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
			updatedFontSize = MAX_ALLOWED_FONT_SIZE
		} else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
			updatedFontSize = MIN_ALLOWED_FONT_SIZE
		}

		setInputValue(inputValueNumber)
		updateFontSizeInSelection(String(updatedFontSize) + 'px', null)
		setInputChangeFlag(false)
	}

	useEffect(() => {
		setInputValue(parseInt(fontSize.slice(0, -2)))
	}, [fontSize])

	return (
		<div className="flex">
			<Button
				disabled={inputValue <= MIN_ALLOWED_FONT_SIZE}
				isIconOnly={true}
				className={cn('rounded-none', inputValue <= MIN_ALLOWED_FONT_SIZE ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-200')}
				onClick={() => handleButtonClick(updateFontSizeType.decrement)}
			>
				-
			</Button>
			<input
				className="text-center"
				type="number"
				value={inputValue}
				min={MIN_ALLOWED_FONT_SIZE}
				max={MAX_ALLOWED_FONT_SIZE}
				onChange={(e) => setInputValue(parseInt(e.target.value))}
				onKeyDown={handleKeyPress}
				onBlur={handleInputBlur}
			/>
			<Button
				disabled={inputValue >= MAX_ALLOWED_FONT_SIZE}
				isIconOnly={true}
				className={cn('rounded-none', inputValue >= MAX_ALLOWED_FONT_SIZE ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-200')}
				onClick={() => handleButtonClick(updateFontSizeType.increment)}
			>
				+
			</Button>
		</div>
	)
}

export default Size
