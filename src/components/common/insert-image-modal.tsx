'use client'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'

interface InsertImageModalProps {
	disclosure: UseDisclosureReturn
}

function InsertImageModal({ disclosure }: InsertImageModalProps) {
	const { isOpen, onOpenChange } = disclosure
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Insert Image</ModalHeader>
							<ModalBody>
								<div className="grid grid-cols-[auto,1fr] gap-5">
									<label htmlFor="file" className="my-auto">
										Image Upload
									</label>
									<input type="file" id="file" className="border border-gray-900 px-3 py-2 rounded-md" />
									<label htmlFor="alt-text" className="my-auto">
										Alt text
									</label>
									<input type="text" id="alt-text" className="border border-gray-900 px-3 py-2 rounded-md" />
									<label htmlFor="position" className="my-auto">
										Position
									</label>
									<input type="text" id="position" className="border border-gray-900 px-3 py-2 rounded-md" />
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
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
