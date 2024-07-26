import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edicao',
  standalone: true,
  imports: [],
  templateUrl: './edicao.component.html',
  styleUrl: './edicao.component.css'
})
export class EdicaoComponent implements OnInit {
  constructor(private readonly router: ActivatedRoute){}

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      console.log(params);
    })
  }


}
