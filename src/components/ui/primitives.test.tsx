import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'
import { IconButton } from './IconButton'
import { SegmentedControl } from './SegmentedControl'

describe('UI primitives', () => {
  it('Button defaults to type="button"', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('IconButton exposes its label as the accessible name', () => {
    render(<IconButton icon={<svg />} label="Next month" />)
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })

  it('SegmentedControl changes value and ignores deselect', async () => {
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="View"
        value="month"
        onValueChange={onChange}
        options={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }))
    expect(onChange).toHaveBeenCalledWith('week')
    onChange.mockClear()
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
