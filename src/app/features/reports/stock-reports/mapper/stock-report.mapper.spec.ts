import { StockReportFilter } from '../models/StockReportFilter';
import { StockReportMapper } from './stock-report.mapper';

describe('StockReportMapper', () => {
  it('should send only movement filters for the movement report', () => {
    const filters = new StockReportFilter();
    filters.search = ' Notebook ';
    filters.status = 'AVAILABLE';
    filters.conditionStatus = 'GOOD';
    filters.active = false;
    filters.movementType = 'EXIT';
    const dto = StockReportMapper.toFilterDTO(filters, 'movements');
    expect(dto.search).toBe('Notebook');
    expect(dto.movementType).toBe('EXIT');
    expect(dto.active).toBeUndefined();
    expect(dto.status).toBeUndefined();
    expect(dto.conditionStatus).toBeUndefined();
  });

  it('should send unit filters without hidden date fields', () => {
    const filters = new StockReportFilter();
    filters.active = false;
    filters.startDate = '2026-01-01';
    const dto = StockReportMapper.toFilterDTO(filters, 'item-units');
    expect(dto.active).toBeFalse();
    expect(dto.status).toBe('ALL');
    expect(dto.startDate).toBeUndefined();
    expect(dto.movementType).toBeUndefined();
  });

  it('should use only category and item in the current summary', () => {
    const filters = new StockReportFilter();
    filters.categoryId = 2;
    filters.itemId = 4;
    filters.active = false;
    filters.search = 'ITEM-4';
    filters.startDate = '2026-01-01';
    const dto = StockReportMapper.toSummaryFilterDTO(filters);
    expect(dto.categoryId).toBe(2);
    expect(dto.itemId).toBe(4);
    expect(dto.active).toBeUndefined();
    expect(dto.search).toBeUndefined();
    expect(dto.startDate).toBeUndefined();
  });

  it('should default missing summary quantities to zero', () => {
    const report = StockReportMapper.toModel({ totalQuantity: 3 });
    expect(report.totalQuantity).toBe(3);
    expect(report.availableQuantity).toBe(0);
    expect(report.lowStockItemCount).toBe(0);
  });
});
