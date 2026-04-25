'use client'

import { Category } from '@/types'

type CategoryFilterProps = {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
        style={{
          backgroundColor: selected === null ? 'var(--color-primary)' : 'var(--color-surface)',
          color: selected === null ? 'white' : 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
        }}
      >
        Todos
      </button>

      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{
            backgroundColor: selected === category.id ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selected === category.id ? 'white' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}