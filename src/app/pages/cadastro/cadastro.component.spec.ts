import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CadastroComponent } from './cadastro.component';
import { ClienteService } from '../../shared/services/cliente.service';
import { TipoPessoa } from '../../models/enums/tipoPessoa';
import { MockClientePut, MockClientePost, MockFormGroup } from '../../shared/mock/mockParaTestes';
import { provideNgxMask } from 'ngx-mask';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  

  beforeEach(() => {
    const spyClienteService = jasmine.createSpyObj('ClienteService', ['postCliente', 'putCliente']);
    const spyToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRouteMock = {
      queryParams: of(MockClientePut)
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ClienteService, useValue: spyClienteService },
        { provide: ToastrService, useValue: spyToastrService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideHttpClientTesting(),
        provideNgxMask(),
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);
    component.cliente = MockClientePut;
    component.clientFormGroup = MockFormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with default values', () => {
    expect(component.clientFormGroup).toBeTruthy();
    expect(component.clientFormGroup.controls['nomeRazaoSocial'].value).toBe('Teste');
    expect(component.clientFormGroup.controls['email'].value).toBe('teste@test.com');
    expect(component.clientFormGroup.controls['telefone'].value).toBe('123456789');
  });

  it('should call mask() on ngOnInit', () => {
    spyOn(component, 'mask');
    component.ngOnInit();
    expect(component.mask).toHaveBeenCalled();
  });

  it('should update mask_cpf_cnpj and inscricaoEstadualPlaceHolder based on tipoPessoa', () => {
    component.clientFormGroup.controls['tipoPessoa'].setValue(TipoPessoa.Fisica);
    component.mask();
    expect(component.mask_cpf_cnpj).toBe('000.000.000-00');
    expect(component.inscEstadualPlaceHolder).toBe('000.000.000-000');
    
    component.clientFormGroup.controls['tipoPessoa'].setValue(TipoPessoa.Juridica);
    component.mask();
    expect(component.mask_cpf_cnpj).toBe('00.000.000/0000-00');
    expect(component.inscEstadualPlaceHolder).toBe('000.000.000-000');
  });

  it('should enable or disable inscricaoEstadual based on isento', () => {
    component.clientFormGroup.controls['isento'].setValue(true);
    component.clientFormGroup.controls['inscricaoEstadual'].disable();
    expect(component.clientFormGroup.controls['inscricaoEstadual'].disabled).toBeTrue();
    
    component.clientFormGroup.controls['isento'].setValue(false);
    component.clientFormGroup.controls['inscricaoEstadual'].enable();
    expect(component.clientFormGroup.controls['inscricaoEstadual'].enabled).toBeTrue();
  });

  it('should call gravar() method', () => {
    component.cliente = MockClientePost;
    clienteServiceSpy.postCliente.and.returnValue(of(MockClientePost));
    component.clientFormGroup = MockFormGroup;
    component.clientFormGroup.setErrors({pessoaJuridicaValida: true})
    component.cadastrarCliente();
    expect(clienteServiceSpy.postCliente).toHaveBeenCalled();
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Sucesso', `Cliente cadastrado: ${MockClientePost.id}`, {timeOut: 5000, closeButton: true});
  });

  it('should handle error in gravar() method', () => {
    component.cliente = MockClientePost;
    component.clientFormGroup = MockFormGroup;
    component.clientFormGroup.setErrors({pessoaJuridicaValida: true})
    clienteServiceSpy.postCliente.and.returnValue(throwError(() => ({status: 400, error: {errors: {"": "Erro"} }})));
    component.cadastrarCliente();
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Erro', 'Erro', {timeOut: 5000, closeButton: true});
  });

  it('should call atualizar() method', () => {
    component.cliente = MockClientePut;
    component.clientFormGroup = MockFormGroup;
    component.clientFormGroup.setErrors({pessoaJuridicaValida: true})
    clienteServiceSpy.putCliente.and.returnValue(of(MockClientePut));
    component.cadastrarCliente();
    expect(clienteServiceSpy.putCliente).toHaveBeenCalled();
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Sucesso', `Cliente Atualizado: ${MockClientePut.id}`, {timeOut: 5000, closeButton: true});
  });

  it('should handle error in atualizar() method', () => {
    component.cliente = MockClientePut;
    component.clientFormGroup = MockFormGroup;
    component.clientFormGroup.setErrors({pessoaJuridicaValida: true})
    clienteServiceSpy.putCliente.and.returnValue(throwError(() => ({status: 400, error: {errors: {"": "Erro"} }})));
    component.cadastrarCliente();
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Erro', 'Erro', {timeOut: 5000, closeButton: true});
  });

  it('should navigate to clients page after saving', () => {
    component.cliente = MockClientePut;
    clienteServiceSpy.putCliente.and.returnValue(of(MockClientePut));
    component.clientFormGroup = MockFormGroup;
    component.clientFormGroup.setErrors({pessoaJuridicaValida: true})
    component.cadastrarCliente();

    expect(routerSpy.navigate).toHaveBeenCalledWith([""]);
  });
});
