import { of, throwError } from 'rxjs';
import { DepartmentListComponent } from './department-list.component';
import { Department } from '../../models/Department';

describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let service: any;
  let auth: any;
  let messages: any;
  let confirmation: any;
  let grid: any;

  beforeEach(() => {
    service = jasmine.createSpyObj('DepartmentService', ['delete', 'findById']);
    auth = jasmine.createSpyObj('AuthService', ['hasAuthority']);
    messages = jasmine.createSpyObj('MessageService', ['add']);
    confirmation = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    grid = jasmine.createSpyObj('DataTableComponent', ['reset']);
    component = new DepartmentListComponent(service, auth, messages, confirmation);
    component.grid = grid;
    auth.hasAuthority.and.returnValue(true);
    component.selectedDepartments = [
      new Department({ id: 1, name: 'Financeiro', description: '' }),
      new Department({ id: 2, name: 'Compras', description: '' }),
    ];
  });

  it('should delete selected departments and refresh the table', async () => {
    service.delete.and.returnValue(of(undefined));
    component.deleteSelectedDepartments();
    await confirmation.confirm.calls.mostRecent().args[0].accept();

    expect(auth.hasAuthority).toHaveBeenCalledWith('DEPARTMENT_DELETE');
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(service.delete).toHaveBeenCalledWith(2);
    expect(component.selectedDepartments).toEqual([]);
    expect(component.deleting).toBeFalse();
    expect(grid.reset).toHaveBeenCalled();
  });

  it('should stop on failure and refresh partially deleted records', async () => {
    service.delete.and.returnValues(of(undefined), throwError(() => new Error('Falha')));
    component.deleteSelectedDepartments();
    await confirmation.confirm.calls.mostRecent().args[0].accept();

    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn' }));
    expect(component.deleting).toBeFalse();
    expect(grid.reset).toHaveBeenCalled();
  });

  it('should not delete without department delete permission', () => {
    auth.hasAuthority.and.returnValue(false);
    component.deleteSelectedDepartments();

    expect(confirmation.confirm).not.toHaveBeenCalled();
    expect(service.delete).not.toHaveBeenCalled();
  });
  it('should load department details when opening the modal', () => {
    service.findById.and.returnValue(of({ id: 1, name: 'Financeiro', description: 'Contas' }));
    component.openDetails(component.selectedDepartments[0]);

    expect(service.findById).toHaveBeenCalledWith(1);
    expect(component.detailsVisible).toBeTrue();
    expect(component.departmentDetails?.description).toBe('Contas');
  });

  it('should close the details modal when loading fails', () => {
    service.findById.and.returnValue(throwError(() => new Error('Não encontrado')));
    component.openDetails(component.selectedDepartments[0]);

    expect(component.detailsVisible).toBeFalse();
    expect(component.departmentDetails).toBeNull();
  });

  it('should not load details without read permission', () => {
    auth.hasAuthority.and.returnValue(false);
    component.openDetails(component.selectedDepartments[0]);

    expect(service.findById).not.toHaveBeenCalled();
    expect(component.detailsVisible).toBeFalse();
  });
});
