import { PositionMapper } from './position.mapper';
import { Position } from '../models/Position';

describe('PositionMapper', () => {
  it('should map list DTO to model', () => {
    const position = PositionMapper.toModel({
      id: 1,
      name: 'Motorista',
    });

    expect(position).toEqual(jasmine.any(Position));
    expect(position.id).toBe(1);
    expect(position.name).toBe('Motorista');
  });

  it('should map details DTO to model with dates and audit fields', () => {
    const position = PositionMapper.toModel({
      id: 2,
      name: 'Atendente',
      createdAt: new Date('2026-01-10T12:00:00Z'),
      updatedAt: new Date('2026-01-11T12:00:00Z'),
      createdBy: 'admin',
      updatedBy: 'manager',
    });

    expect(position.id).toBe(2);
    expect(position.name).toBe('Atendente');
    expect(position.createdAt).toEqual(jasmine.any(Date));
    expect(position.updatedAt).toEqual(jasmine.any(Date));
    expect(position.createdBy).toBe('admin');
    expect(position.updatedBy).toBe('manager');
  });

  it('should map empty nullable audit fields to undefined', () => {
    const position = PositionMapper.toModel({
      id: 3,
      name: 'Auxiliar',
      createdAt: undefined,
      updatedAt: undefined,
      createdBy: '',
      updatedBy: undefined,
    });

    expect(position.createdAt).toBeUndefined();
    expect(position.updatedAt).toBeUndefined();
    expect(position.createdBy).toBeUndefined();
    expect(position.updatedBy).toBeUndefined();
  });

  it('should trim name when mapping insert and update DTOs', () => {
    const position = new Position({ name: '  Gerente  ' });

    expect(PositionMapper.toInsertDTO(position).name).toBe('Gerente');
    expect(PositionMapper.toUpdateDTO(position).name).toBe('Gerente');
  });
});
