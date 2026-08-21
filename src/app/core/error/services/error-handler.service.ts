import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService) {}

  handle(errorResponse: any) {
    const msg = this.extractMessage(errorResponse);

    console.error('Ocorreu um erro', errorResponse);

    this.messageService.add({
      severity: 'error',
      detail: msg,
    });
  }

  private extractMessage(errorResponse: any): string {
    if (typeof errorResponse === 'string') {
      return errorResponse;
    }

    
    if (errorResponse instanceof HttpErrorResponse) {
      if (errorResponse.status === 0) {
        return 'Não foi possível conectar ao servidor. Verifique se o backend está ligado e se o CORS está configurado.';
      }

      if (errorResponse.status === 403) {
        return 'Você não tem permissão para executar esta ação';
      }

      if (errorResponse.status === 401) {
        return 'Sua sessão expirou. Faça login novamente.';
      }

      if (errorResponse.status >= 400 && errorResponse.status <= 499) {
        const extracted = this.tryExtractFromBody(errorResponse);
        return extracted ?? 'Ocorreu um erro ao processar a sua solicitação';
      }

      if (errorResponse.status >= 500) {
        const extracted = this.tryExtractFromBody(errorResponse);
        return extracted ?? 'Erro no servidor. Tente novamente mais tarde.';
      }
    }

    return 'Erro ao processar serviço remoto. Tente novamente.';
  }

  private tryExtractFromBody(errorResponse: HttpErrorResponse): string | null {
    const body: any = errorResponse.error;

    if (body && typeof body === 'object') {
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        const first = body.errors[0];
        if (typeof first === 'string') return first;
        if (first && typeof first.message === 'string') return first.message;
      }

      if (typeof body.message === 'string') return body.message;
      if (typeof body.error === 'string') return body.error;
    }

    if (typeof body === 'string' && body.trim().length > 0) {
      return body;
    }

    return null;
  }
}
