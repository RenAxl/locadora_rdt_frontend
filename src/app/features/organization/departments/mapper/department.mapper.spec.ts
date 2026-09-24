import { DepartmentMapper } from './department.mapper';

describe('DepartmentMapper', () => {
  it('should preserve the description returned by the listing API', () => {
    const department = DepartmentMapper.toModel({
      id: 1,
      name: 'Financeiro',
      description: 'Controle de contas',
    });

    expect(department.description).toBe('Controle de contas');
  });

  it('should accept a department without description', () => {
    const department = DepartmentMapper.toModel({ id: 1, name: 'Financeiro', description: null });

    expect(department.description).toBe('');
  });
  it('should convert API dates and preserve audit names', () => {
    const dto = JSON.parse(JSON.stringify({
      id: 1, name: 'Financeiro',
      createdAt: '2026-09-23T12:00:00Z', updatedAt: '2026-09-24T12:00:00Z',
      createdBy: 'Cadastro', updatedBy: 'Edição',
    }));
    const department = DepartmentMapper.toModel(dto);

    expect(department.createdAt).toEqual(new Date('2026-09-23T12:00:00Z'));
    expect(department.updatedAt).toEqual(new Date('2026-09-24T12:00:00Z'));
    expect(department.createdBy).toBe('Cadastro');
    expect(department.updatedBy).toBe('Edição');
  });

  it('should not invent dates when audit dates are null', () => {
    const dto = JSON.parse('{"id":1,"name":"Financeiro","createdAt":null,"updatedAt":null}');
    const department = DepartmentMapper.toModel(dto);

    expect(department.createdAt).toBeUndefined();
    expect(department.updatedAt).toBeUndefined();
  });
});
