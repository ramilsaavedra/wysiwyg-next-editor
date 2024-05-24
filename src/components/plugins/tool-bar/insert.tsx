import InsertImageModal from '@/components/common/insert-image-modal'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, useDisclosure } from '@nextui-org/react'
import { LexicalEditor } from 'lexical'

interface InsertProps {
	editor: LexicalEditor
}

function Insert({ editor }: InsertProps) {
	const imageModal = useDisclosure()

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button className="rounded-none">Insert</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions">
					<DropdownItem key="image">
						<div onClick={() => imageModal.onOpen()}>Image</div>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<InsertImageModal disclosure={imageModal} />
		</>
	)
}

export default Insert
