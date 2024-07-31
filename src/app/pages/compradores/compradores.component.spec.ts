import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CompradoresComponent } from './compradores.component';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente } from '../../models/cliente';
import { ClientePage } from '../../models/cliente-page';
import { PhonePipe } from '../../shared/pipe/phone.pipe';
import { MockClientePut, MockClientePages } from '../../shared/mock/mockParaTestes';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNgxMask } from 'ngx-mask';

describe('CompradoresComponent', () => {
  let component: CompradoresComponent;
  let fixture: ComponentFixture<CompradoresComponent>;
  let mockClienteService: jasmine.SpyObj<ClienteService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getCliente', 'getByName']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        provideHttpClientTesting(),
        provideNgxMask(),
      ]
    }).compileComponents();
    
    mockClienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    mockClienteService.getCliente.and.returnValue(of(MockClientePages))

    
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pageNumber).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(component.todosMarcados).toBeFalse();
    expect(component.parcialmenteMarcado).toBeFalse();
  });

  it('should call getClientesPerPage on ngOnInit', () => {
    const spy = spyOn(component, 'getClientesPerPage');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(component.pageNumber, component.pageSize);
  });

  it('should handle successful client fetch', () => {
    const clientePage: ClientePage = {
      items: [{} as Cliente],
      currentPage: 1,
      totalPage: 1,
      pageSize: 1,
      totalCount: 1
    };
    
    mockClienteService.getCliente.and.returnValue(of(clientePage));
    
    component.getClientesPerPage(component.pageNumber, component.pageSize);
    fixture.detectChanges();

    expect(component.clientes).toEqual(clientePage);
    expect(component.formArray instanceof FormArray).toBeTrue();
  });

  it('should handle client fetch error', () => {
    mockClienteService.getCliente.and.returnValue(throwError(() => new Error('Fetch failed')));

    component.getClientesPerPage(component.pageNumber, component.pageSize);
    fixture.detectChanges();

    // Add logic to handle error state if needed
  });

  it('should navigate to cadastro on edicao', () => {
    const cliente: Cliente = MockClientePut
    component.edicao(cliente);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['cadastro'], { queryParams: cliente });
  });

  it('should navigate to cadastro on cadastro', () => {
    component.cadastro();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['cadastro']);
  });

  it('should update todosMarcados and parcialmenteMarcado correctly', () => {
    component.formGroup.addControl('formArray', component.buildCompradoresCheckbox([{}] as Cliente[]));
    component.update();
    expect(component.todosMarcados).toBeFalse();
    expect(component.parcialmenteMarcado).toBeFalse();

    component.updateAll(true);
    component.update();
    expect(component.todosMarcados).toBeTrue();
    expect(component.parcialmenteMarcado).toBeFalse();

    component.updateAll(false);
    component.update();
    expect(component.todosMarcados).toBeFalse();
    expect(component.parcialmenteMarcado).toBeFalse();
  });

  it('should handle buscaByName success', () => {
    const clientePage: ClientePage = {
      items: [],
      currentPage: 1,
      totalPage: 1,
      pageSize: 1,
      totalCount: 1
    };

    mockClienteService.getByName.and.returnValue(of(clientePage));
    component.buscaFormGroup.controls.busca.setValue('John Doe');
    component.buscaByName();
    fixture.detectChanges();

    expect(component.clientes).toEqual(clientePage);
  });

  it('should handle buscaByName error', () => {
    mockClienteService.getByName.and.returnValue(of(MockClientePages));

    component.buscaFormGroup.controls.busca.setValue('John Doe');
    component.buscaByName();
    fixture.detectChanges();

    // Add logic to handle error state if needed
  });
});
