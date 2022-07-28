import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  Auth,
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface Choice {
  value: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  invalidChoices = false;
  choiceModel: string = ''
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  choices: Choice[] = [];
  constructor(public auth: Auth, public firestore: Firestore, public snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  createSubmit(form: any) {
    if (this.choices.length < 2) {
      this.invalidChoices = true
      return;
    }
    form.value.choices = this.choices
    this.addRank(form.value);
    let snackBarRef = this.snackBar.open("Ranking successfully added!", "Okay", {
      duration: 3000
    })
    form.resetForm();
    this.choices = []
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['trending']);
    })
  }

  addRank(values: any) {
    const dbInstance = collection(this.firestore, 'rankings');
    addDoc(dbInstance, values).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  add(event: MatChipInputEvent) {
    this.invalidChoices = false;
    const value = (event.value || '').trim();

    //Add our choice
    if (value) {
      this.choices.push({ value: value });
    }

    event.chipInput!.clear();
  }

  remove(choice: Choice) {

    const index = this.choices.indexOf(choice);

    if (index >= 0) {
      this.choices.splice(index, 1);
    }
  }

}
