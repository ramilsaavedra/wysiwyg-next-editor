'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

const theme = {
	heading: {
		h1: 'text-6xl',
		h2: 'text-5xl',
		h3: 'text-4xl',
		h4: 'text-3xl',
		h5: 'text-2xl',
		h6: 'text-xl',
	},
	text: {
		bold: 'font-bold',
		italic: 'italic',
		underline: 'underline-offset-1',
	},
}

function onError(error: Error) {
	console.error(error)
}

interface EditorProps {
	onChange: () => void
}

function Editor({ onChange }: EditorProps) {
	const initialConfig = {
		namespace: '',
		theme,
		onError,
	}

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className="relative w-[50%] h-[300px] mx-auto text-white ">
				<RichTextPlugin
					contentEditable={<ContentEditable className="h-full p-3 rounded-lg border focus-visible:outline-none" />}
					placeholder={<div className="absolute text-gray-700 top-0 left-0 p-3 pointer-events-none">Enter some text...</div>}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<OnChangePlugin onChange={(editorState) => console.log(editorState, 'EDITOR STATE')} />
				<HistoryPlugin />
				<AutoFocusPlugin />
			</div>
		</LexicalComposer>
	)
}
export default Editor
