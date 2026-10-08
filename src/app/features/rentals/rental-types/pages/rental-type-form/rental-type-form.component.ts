import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RentalTypeService } from '../../services/rental-type.service';
import { RentalTypeMapper } from '../../mapper/rental-type.mapper';
import { RentalType } from '../../models/RentalType';

@Component({
  selector: 'app-rental-type-form',
  templateUrl: './rental-type-form.component.html',
  styleUrls: ['./rental-type-form.component.css'],
})
export class RentalTypeFormComponent implements OnInit {
  rentalType: RentalType = new RentalType();

  private editing: boolean = false;

  constructor(
    private rentalTypeService: RentalTypeService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('rentalTypeId');

    if (id != null) {
      this.editing = true;
      this.loadRentalType(id);
    }
  }

  loadRentalType(id: number | string): void {
    this.rentalTypeService.findById(id).subscribe((data) => {
      const rentalTypeFound = RentalTypeMapper.toModel(data);
      this.rentalType = rentalTypeFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.rentalType.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const rentalTypeToInsert = RentalTypeMapper.toInsertDTO(this.rentalType);

    this.rentalTypeService.insert(rentalTypeToInsert).subscribe((data) => {
      this.rentalType = RentalTypeMapper.toModel(data);
      this.finish();
    });
  }

  update(): void {
    const rentalTypeToUpdate = RentalTypeMapper.toUpdateDTO(this.rentalType);

    this.rentalTypeService.update(rentalTypeToUpdate).subscribe(() => {
      this.finish();
    });
  }

  finish(): void {
    this.router.navigate(['/rental-types/']);

    let detail = 'Tipo de locação cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Tipo de locação atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
