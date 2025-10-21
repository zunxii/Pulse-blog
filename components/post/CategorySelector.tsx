'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { trpc } from '@/server/trpc/client'
import { cn } from '@/lib/utils'

interface CategorySelectorProps {
  selected: string[]
  onChange: (categories: string[]) => void
}

export function CategorySelector({ selected, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const { data: categories, isLoading } = trpc.categories.getAll.useQuery()

  const toggleCategory = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onChange(selected.filter(id => id !== categoryId))
    } else {
      onChange([...selected, categoryId])
    }
  }

  const selectedNames = categories
    ?.filter(cat => selected.includes(cat.id))
    .map(cat => cat.name)
    .join(', ') || 'Select categories'

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm text-white/60 mb-2">
        Categories
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        <span className={cn(
          "text-sm",
          selected.length === 0 && "text-white/40"
        )}>
          {selectedNames}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-gray-950 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="text-xs text-white/50 mt-0.5">
                        {category.description}
                      </p>
                    )}
                  </div>
                  {selected.includes(category.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-white/60 text-sm">
                No categories available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}