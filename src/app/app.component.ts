import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import * as _ from "lodash";

import { ToastrService } from 'ngx-toastr';

import { HttpService } from './services/http.service';
import { AppConfigService } from './services/app-config.service';
import { ExcelexportService } from './services/excelexport.service';
import { AuthService } from './services/auth.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private httpService: HttpService, private appConfigService: AppConfigService, private authService: AuthService,
    private toastr: ToastrService, private excelService: ExcelexportService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    try{
    }catch(e){
      this.toastr.error(e.message);
    }
  }
}
