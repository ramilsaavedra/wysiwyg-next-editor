import Editor from '@/components/editor'

export default function Home() {
	return (
		<main className="bg-gray-100 h-screen w-full">
			<h1 className="text-center font-bold py-3 text-2xl">Rich Text Editor</h1>
			<Editor />
		</main>
	)
}
