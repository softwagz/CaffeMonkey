import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/servicios/register.service';
import { ArticleService } from 'src/app/servicios/article.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as sweetalert from 'sweetalert2';
import { Registro } from '../../modelo/registro';
import { Cliente } from 'src/app/modelo/cliente';
import { Articulo } from 'src/app/modelo/articulo';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private service: RegisterService, private serviceArticle: ArticleService) { }

  ngOnInit(): void {

    this.Swal = sweetalert.default;
    this.loadArticle();
    this.loadClients();
    this.formRegister = new FormGroup(
      {
        rut: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required),
        cantidad: new FormControl('', Validators.required),
        saldo: new FormControl('')
      }
    );
    this.formAbono = new FormGroup(
      {
        abono: new FormControl('', Validators.required)
      });
    this.formAgregar = new FormGroup(
      {
        cantidadAdd: new FormControl('', Validators.required)
      }
    )
  }
  Swal: any;
  index: any;
  dataClientes: any;
  dataArticle: any;
  articulos: any = [];
  cant = 0;
  total = 0;
  formRegister: FormGroup;
  formAbono: FormGroup;
  formAgregar: FormGroup;
  clienteSelected = {
    id: "",
    data: {
      rut: "",
      nombre: "",
      saldo: 0,
      articulos: [
        {
          fecha: "", nombre: "", cantidad: 0, total: 0
        }
      ],
    }
  };


  eliminar(cliente: any) {
    if (confirm('¿Desea Elimnar?,esta opcion no se puede deshacer')) {
      this.service.delete(cliente.id).then(
        success => {
          this.Swal.fire({
            title: 'Exito',
            text: 'Se ha Eliminado el Cliente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        },
        fail => {
          this.Swal.fire({
            title: 'Disculpe',
            text: 'No se ha podido Eliminar el Cliente',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }
      )
    }

  }

  carAdd() {

    var select = <HTMLInputElement>document.getElementById('articleSelec');
    if (select.value != "0" && Number.parseFloat(this.formRegister.get('cantidad').value)>0) {
      this.dataArticle.map((key) => {
        if (key['id'] == select.value) {
          var date = new Date();
          var fecha = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
          var { nombre, precio } = key['data'];
          var total = Number.parseFloat(precio) * Number.parseFloat(this.formRegister.get('cantidad').value);
          var cantidad = Number.parseFloat(this.formRegister.get('cantidad').value);
          var data = { nombre, total, cantidad, precio, fecha }
          this.articulos.push(data);
          this.calcularSaldo();
        }
      });
    } else {
      this.Swal.fire({
        title: 'Disculpe',
        text: 'Seleccione un Producto y una cantidad',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })

    }

  }

  registerNew() {

    //registra el cliente y la compra nueva

    if (this.formRegister.valid) {
      if (this.articulos.length > 0) {
        var { rut, nombre, saldo } = this.formRegister.value;
        var articulos = this.articulos;
        var data = { rut, nombre, articulos, saldo }
        this.service.add(data);
        this.limpiar();
        this.Swal.fire({
          title: 'Exito',
          text: 'Se ha registrado el Cliente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
  
      } else {
        this.Swal.fire({
          title: 'Disculpe',
          text: 'Agregue un producto al cliente',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        })
      }

    }
    else {
      this.Swal.fire({
        title: 'Disculpe',
        text: 'Complete los datos del Cliente',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })

    }


  }

  registerCompra() {
    //registra la compra a un cliente existente -> modal
    var select = <HTMLInputElement>document.getElementById('selectRegistrarCompra');
    if (this.formAgregar.valid && select.value != "0") {
      var data;
      this.dataArticle.map((key) => {
        if (key['id'] == select.value) {
          var date = new Date();
          var fecha = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
          var { nombre, precio } = key['data'];

          var total = Number.parseFloat(precio) * Number.parseFloat(this.formAgregar.get('cantidadAdd').value);
          var cantidad = Number.parseFloat(this.formAgregar.get('cantidadAdd').value);
          data = { nombre, total, cantidad, precio, fecha }
          

            this.calcularSaldo(this.clienteSelected.data.saldo, total);
            this.clienteSelected.data.articulos.push(data);
            this.clienteSelected.data.saldo = this.cant;
            this.service.update(this.clienteSelected).then(
              sucess => {
                this.Swal.fire({
                  title: 'Exito',
                  text: 'Agregado',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                var data = this.clienteSelected.data.articulos;
                data.sort((a, b) => {
                  if (Date.parse(a.fecha) > Date.parse(b.fecha)) {
                    return -1;
                  }
                });
                this.clienteSelected.data.articulos = data;
              },
              fail => {
              }
            )
        }
      });

    } else {
      this.Swal.fire({
        title: 'Disculpe',
        text: 'Seleccione un articulo y una cantidad',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  abonar() {
    //actualiza el campo de saldo
    if (this.formAbono.valid) {
      var saldo = this.clienteSelected.data.saldo;
      var abono = this.formAbono.get('abono').value;
      if (saldo >= abono) {
        var newSaldo = saldo - abono;
        this.clienteSelected.data.saldo = newSaldo;
        this.service.update(this.clienteSelected).then(
          success => {
            this.Swal.fire({
              title: 'Exito',
              text: 'Abonó a la cuenta',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.formAbono.reset();
            //            this.ordenar(this.clienteSelected['data']['articulos']['fecha']);
          },
          fail => {
            this.Swal.fire({
              title: 'Disculpe',
              text: 'No se ha podido abonar',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            })
          }
        );
      } else {
        this.Swal.fire({
          title: 'Disculpe',
          text: 'El abono maximo debe ser igual al saldo',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        })
      }
    } else {
      this.Swal.fire({
        title: 'Disculpe',
        text: 'Ingrese un monto',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  turnEditar() {
    //cambiar boton editar
  }

  loadArticle() {
    this.serviceArticle.log().subscribe(
      resultado => {
        this.dataArticle = resultado.map(
          items => {
            return {
              id: items.payload.doc.id,
              data: items.payload.doc.data()
            }
          }
        );
        console.log(this.dataArticle);

      }
    )
  }

  loadClients() {

    this.service.loadCli().subscribe(
      resultado => {
        this.dataClientes = resultado.map(
          items => {
            return {
              id: items.payload.doc.id,
              data: items.payload.doc.data()
            }
          }
        );
        console.log(this.dataClientes);

      }
    )


  }

  ordenar(data: []) {
    data.sort((a, b) => {
      return a - b;
    });
  }
  //Funciones de apoyo

  ver(cliente) {
    this.clienteSelected = cliente;
    var data = this.clienteSelected.data.articulos;
    data.sort((a, b) => {
      if (Date.parse(a.fecha) > Date.parse(b.fecha)) {
        return -1;
      }
    });
    this.clienteSelected.data.articulos = data;



  }

  calcularSaldo(saldo?: number, total?: number) {
    if (saldo) {
      this.cant = 0;
      this.cant = saldo + total;

    } else {
      this.total = 0;
      this.articulos.forEach(element => {
        this.total += element['total'];
      });
      this.formRegister.get('saldo').setValue(this.total);
    }
  }

  limpiar() {
    this.formRegister.reset();
    this.articulos.splice(0);
    this.total = 0;
  }

  get nombre() {
    return this.formRegister.get('nombre');

  };

  get rut() {
    return this.formRegister.get('rut');
  }

  get cantidad() {
    return this.formRegister.get('cantidad');
  }

  get saldo() {
    return this.formRegister.get('saldo');
  }

  get abono() {
    return this.formAbono.get('abono')
  }

  get cantidadAdd() {
    return this.formAgregar.get('cantidadAdd').value;

  }

}
