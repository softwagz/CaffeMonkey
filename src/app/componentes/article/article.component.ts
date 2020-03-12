import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/servicios/article.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as swalModule from 'sweetalert2'
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  constructor(private form: FormBuilder, private service: ArticleService) { }

  ngOnInit(): void {
    this.loadArticle();
    this.Swal = swalModule.default;
    this.formArticle = new FormGroup(
      {
        id: new FormControl(''),
        nombre: new FormControl('', Validators.required),
        precio: new FormControl('', Validators.required)
      }
    )
  }
  Swal:any;
  formArticle: FormGroup;
  price = 2000;
  dataArticulos: any;
  btnSaveRegister = 'Registrar';
  statusSave = false;
  btnDisable = false;
  btnCancelar = 'Eliminar';
  statusCancelar=false;
  

  registrarArticle() {
    if (!this.statusSave) {
      this.service.add(this.formArticle.value).then(succes => {
        this.Swal.fire({
          title: 'Exito',
          text: 'Se ha registrado el Articulo',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.formArticle.reset();
      },
        fail => {
          this.Swal.fire({
            title: 'Disculpe',
            text: 'No se ha podido Registrar',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }
      )
    } else {
      this.service.update(this.formArticle.value).then(
        succ=>{
          this.turnRegister();
          this.formArticle.reset();
          this.Swal.fire({
            title: 'Exito',
            text: 'Se ha Modificado el Articulo',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.turnCancelar();
        },
        fail=>{
          this.Swal.fire({
            title: 'Disculpe',
            text: 'No se ha podido Modificar',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }
      );

    }
  }

  editarArticle(article: any) {
    this.formArticle.get('id').setValue(article.id);
    this.formArticle.get('nombre').setValue(article.data.nombre);
    this.formArticle.get('precio').setValue(article.data.precio);
    this.turnRegister();
  }

  deleteArticle(id: string) {
    if(!this.statusCancelar){
      if (confirm('¿Desea Eliminar Este Articulo?')) {
        this.service.delete(id).then(
          success => {
            this.Swal.fire({
              title: 'Exito',
              text: 'Se ha Eliminado el Articulo',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })          },
          fail => {
            this.Swal.fire({
              title: 'Disculpe',
              text: 'No se ha podido Eliminar el Articulo',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            })
          }
        );
      }
    }else{
      this.turnCancelar();
    }
  }

  loadArticle() {
    this.service.log().subscribe(
      resultado => {
        this.dataArticulos = resultado.map(
          items => {
            return {
              id: items.payload.doc.id,
              data: items.payload.doc.data()
            }
          }
        );
        console.log(this.dataArticulos);

      }
    )


  }

  turnRegister() {
    if (!this.statusSave) {
      this.statusSave = true;
      this.btnSaveRegister = 'Guardar';
      this.btnDisable = true;
      this.turnCancelar();

    } else {
      this.statusSave = false;
      this.btnSaveRegister = "Registrar";
      this.btnDisable = false;

    }
  }
  turnCancelar(){
    if(!this.statusCancelar){
      this.statusCancelar = true;
      this.btnCancelar = 'Cancelar';
    }else{
      this.turnRegister();
      this.btnCancelar = 'Eliminar';
      this.statusCancelar=false;
      this.formArticle.reset();
    }
  }

  get id() {
    return this.formArticle.get('id');
  }

  get nombre() {
    return this.formArticle.get('nombre');
  }

  get precio() {
    return this.formArticle.get('precio');
  }

}
