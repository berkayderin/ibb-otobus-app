import { useQuery } from '@tanstack/react-query'
import {
	getHatBilgisi,
	getSeferBilgisi,
	getDuraklar,
	getDuyurular,
	getFiloBilgisi
} from '../services/transportService'

export const useHatBilgisi = (hatKodu) => {
	return useQuery({
		queryKey: ['hatBilgisi', hatKodu],
		queryFn: () => getHatBilgisi(hatKodu),
		enabled: !!hatKodu
	})
}

export const useSeferBilgisi = (hatKodu) => {
	return useQuery({
		queryKey: ['seferBilgisi', hatKodu],
		queryFn: () => getSeferBilgisi(hatKodu),
		enabled: !!hatKodu
	})
}

export const useDuraklar = () => {
	return useQuery({
		queryKey: ['duraklar'],
		queryFn: getDuraklar
	})
}

export const useDuyurular = () => {
	return useQuery({
		queryKey: ['duyurular'],
		queryFn: getDuyurular
	})
}

export const useFiloBilgisi = () => {
	return useQuery({
		queryKey: ['filoBilgisi'],
		queryFn: getFiloBilgisi
	})
}
