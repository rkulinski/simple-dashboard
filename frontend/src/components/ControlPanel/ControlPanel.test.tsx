import { render, screen } from '@testing-library/react';
import { ControlPanel } from 'components/ControlPanel/ControlPanel';
import { NOOP } from 'testingUtils/factories';

const baseProps = {
  onFiltersApply: NOOP,
  campaigns: [],
  dataSourcesOptions: [],
  onCampaignSearch: NOOP,
  disableApply: false,
};

describe('ControlPanel', () => {
  test('should disable button when disableApply is true', () => {
    const mockOnApplyFilters = jest.fn();
    render(
      <ControlPanel
        {...baseProps}
        disableApply
        onFiltersApply={mockOnApplyFilters}
      />
    );
    const applyButton = screen.getByText('Apply');
    applyButton.click();
    expect(mockOnApplyFilters).toHaveBeenCalledTimes(0);
  });
  test('should enable button when disableApply is false', () => {
    const mockOnApplyFilters = jest.fn();
    render(
      <ControlPanel
        {...baseProps}
        disableApply={false}
        onFiltersApply={mockOnApplyFilters}
      />
    );
    const applyButton = screen.getByText('Apply');
    applyButton.click();
    expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
  });
});
