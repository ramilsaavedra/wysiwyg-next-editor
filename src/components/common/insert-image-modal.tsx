'use client'

import { useRef, useState, useEffect } from 'react'
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { Position } from '../plugins/image-plugin/image-node'
import { LexicalEditor } from 'lexical'
import { INSERT_INLINE_IMAGE_COMMAND } from '../plugins/image-plugin'

interface InsertImageModalProps {
	disclosure: UseDisclosureReturn
	editor: LexicalEditor
}

function InsertImageModal({ disclosure, editor }: InsertImageModalProps) {
	const { isOpen, onOpenChange, onClose } = disclosure

	const hasModifier = useRef(false)

	const [src, setSrc] = useState('')
	const [altText, setAltText] = useState('')
	const [showCaption, setShowCaption] = useState(false)
	const [position, setPosition] = useState<Position>('left')

	const isDisabled = src === ''

	const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowCaption(e.target.checked)
	}

	const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPosition(e.target.value as Position)
	}

	const loadImage = (files: FileList | null) => {
		const reader = new FileReader()
		reader.onload = function () {
			if (typeof reader.result === 'string') {
				setSrc(reader.result)
			}
			return ''
		}
		if (files !== null) {
			reader.readAsDataURL(files[0])
		}
	}

	useEffect(() => {
		hasModifier.current = false
		const handler = (e: KeyboardEvent) => {
			hasModifier.current = e.altKey
		}
		document.addEventListener('keydown', handler)
		return () => {
			document.removeEventListener('keydown', handler)
		}
	}, [editor])

	const handleOnClick = () => {
		const payload = { altText, position, showCaption, src }
		editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload)
		onClose()
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Insert image</ModalHeader>
							<ModalBody>
								<div className="grid grid-cols-[auto,1fr] gap-5">
									<label htmlFor="file" className="my-auto">
										Image Upload
									</label>
									<input
										type="file"
										id="file"
										className="border border-gray-900 px-3 py-2 rounded-md"
										accept="image/*"
										onChange={(e) => loadImage(e.target.files)}
									/>
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
									<label htmlFor="position" className="my=auto">
										Position
									</label>
									<select
										style={{ marginBottom: '1em', width: '290px' }}
										name="position"
										id="position-select"
										onChange={handlePositionChange}
									>
										<option value="left">Left</option>
										<option value="right">Right</option>
										<option value="full">Full Width</option>
									</select>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={() => {
										handleOnClick()
									}}
								>
									Insert Image
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default InsertImageModal
