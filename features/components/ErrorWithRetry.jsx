import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ErrorWithRetry({ error, onRetry }) {
	const [isSpinning, setIsSpinning] = useState(false)

	const handleRetry = async () => {
		setIsSpinning(true)
		await onRetry()
		setTimeout(() => setIsSpinning(false), 1000)
	}

	return (
		<Card className="border-destructive">
			<CardContent className="p-4">
				<div className="flex flex-col items-center gap-4">
					<p className="text-destructive">{error.message}</p>
					<Button
						variant="outline"
						size="sm"
						onClick={handleRetry}
						className="gap-2"
						disabled={isSpinning}
					>
						<RefreshCw
							className={cn('h-4 w-4', {
								'animate-spin': isSpinning
							})}
						/>
						Yeniden Dene
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
