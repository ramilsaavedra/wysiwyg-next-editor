import { Button, Tooltip, cn } from '@nextui-org/react'
import { LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical'

interface UndoRedoProps {
	editor: LexicalEditor
	canUndo: boolean
	canRedo: boolean
}

function UndoRedo({ editor, canUndo, canRedo }: UndoRedoProps) {
	const handleUndo = () => {
		editor.dispatchCommand(UNDO_COMMAND, undefined)
	}

	const handleRedo = () => {
		editor.dispatchCommand(REDO_COMMAND, undefined)
	}

	return (
		<div className="flex">
			<Button
				isIconOnly
				className={cn('rounded-none', canUndo ? 'bg-gray-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed')}
				onClick={handleUndo}
				disabled={!canUndo}
			>
				<svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M5.70686 0.334618C5.89434 0.548939 5.99965 0.839581 5.99965 1.14263C5.99965 1.44568 5.89434 1.73632 5.70686 1.95064L3.41383 4.57125H8.99991C10.8564 4.57125 12.6369 5.41412 13.9497 6.91444C15.2625 8.41475 16 10.4496 16 12.5714V14.8571C16 15.1602 15.8946 15.4509 15.7071 15.6653C15.5196 15.8796 15.2652 16 15 16C14.7348 16 14.4804 15.8796 14.2929 15.6653C14.1053 15.4509 14 15.1602 14 14.8571V12.5714C14 11.0558 13.4732 9.60236 12.5355 8.5307C11.5978 7.45905 10.326 6.857 8.99991 6.857H3.41383L5.70686 9.47762C5.80237 9.58304 5.87856 9.70915 5.93097 9.84859C5.98338 9.98802 6.01096 10.138 6.01212 10.2897C6.01327 10.4415 5.98797 10.592 5.93769 10.7324C5.88741 10.8729 5.81315 11.0005 5.71926 11.1078C5.62536 11.2151 5.51371 11.3 5.39081 11.3574C5.26791 11.4149 5.13623 11.4438 5.00345 11.4425C4.87067 11.4412 4.73945 11.4097 4.61744 11.3498C4.49544 11.2899 4.38509 11.2028 4.29284 11.0936L0.29279 6.52214C0.105317 6.30782 0 6.01718 0 5.71413C0 5.41108 0.105317 5.12044 0.29279 4.90612L4.29284 0.334618C4.48037 0.120362 4.73469 0 4.99985 0C5.26502 0 5.51933 0.120362 5.70686 0.334618Z"
						fill="currentColor"
					/>
				</svg>
			</Button>
			<Button
				isIconOnly
				className={cn('rounded-none', canRedo ? 'bg-gray-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed')}
				onClick={handleRedo}
				disabled={!canRedo}
			>
				<svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M10.2931 0.334618C10.1057 0.548939 10.0003 0.839581 10.0003 1.14263C10.0003 1.44568 10.1057 1.73632 10.2931 1.95064L12.5862 4.57125H7.00009C5.14355 4.57125 3.36305 5.41412 2.05028 6.91444C0.737508 8.41475 2.85218e-09 10.4496 2.85218e-09 12.5714V14.8571C2.85218e-09 15.1602 0.105357 15.4509 0.292896 15.6653C0.480435 15.8796 0.734793 16 1.00001 16C1.26523 16 1.51959 15.8796 1.70713 15.6653C1.89467 15.4509 2.00003 15.1602 2.00003 14.8571V12.5714C2.00003 11.0558 2.52682 9.60236 3.46451 8.5307C4.40221 7.45905 5.67399 6.857 7.00009 6.857H12.5862L10.2931 9.47762C10.1976 9.58304 10.1214 9.70915 10.069 9.84859C10.0166 9.98802 9.98904 10.138 9.98788 10.2897C9.98673 10.4415 10.012 10.592 10.0623 10.7324C10.1126 10.8729 10.1868 11.0005 10.2807 11.1078C10.3746 11.2151 10.4863 11.3 10.6092 11.3574C10.7321 11.4149 10.8638 11.4438 10.9965 11.4425C11.1293 11.4412 11.2606 11.4097 11.3826 11.3498C11.5046 11.2899 11.6149 11.2028 11.7072 11.0936L15.7072 6.52214C15.8947 6.30782 16 6.01718 16 5.71413C16 5.41108 15.8947 5.12044 15.7072 4.90612L11.7072 0.334618C11.5196 0.120362 11.2653 0 11.0001 0C10.735 0 10.4807 0.120362 10.2931 0.334618Z"
						fill="currentColor"
					/>
				</svg>
			</Button>
		</div>
	)
}

export default UndoRedo
