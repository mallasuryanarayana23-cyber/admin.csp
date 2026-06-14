import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
  })
}

export function usePerformanceDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'performance'],
    queryFn: dashboardService.getPerformanceDistribution,
  })
}

export function useRiskTypology() {
  return useQuery({
    queryKey: ['dashboard', 'risk-typology'],
    queryFn: dashboardService.getRiskTypology,
  })
}

export function useInstitutions() {
  return useQuery({
    queryKey: ['dashboard', 'institutions'],
    queryFn: dashboardService.getInstitutions,
  })
}
