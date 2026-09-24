import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PositionService } from '../../services/position.service';
import { PositionMapper } from '../../mapper/position.mapper';
import { Position } from '../../models/Position';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.css'],
})
export class PositionFormComponent implements OnInit {
  position: Position = new Position();

  private editing: boolean = false;

  constructor(
    private positionService: PositionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('positionId');

    if (id != null) {
      this.editing = true;
      this.loadPosition(id);
    }
  }

  loadPosition(id: number | string): void {
    this.positionService.findById(id).subscribe((data) => {
      const positionFound = PositionMapper.toModel(data);
      this.position = positionFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.position.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const positionToInsert = PositionMapper.toInsertDTO(this.position);

    this.positionService.insert(positionToInsert).subscribe((data) => {
      this.position = PositionMapper.toModel(data);
      this.finish();
    });
  }

  update(): void {
    const positionToUpdate = PositionMapper.toUpdateDTO(this.position);

    this.positionService.update(positionToUpdate).subscribe(() => {
      this.finish();
    });
  }

  finish(): void {
    this.router.navigate(['/positions/']);

    let detail = 'Cargo cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Cargo atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
