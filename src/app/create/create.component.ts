import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  Auth,
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChildrenOutletContexts, Router } from '@angular/router';

export interface Choice {
  value: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  currUserId: any;
  invalidChoices = false;
  choiceModel: string = ''
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  choices: Choice[] = [];
  sliderLength = 2;
  invalidTitle = false;
  invalidPrompt = false;
  constructor(public auth: Auth, public firestore: Firestore, public snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currUserId = user.uid;
      }
    })
  }

  createSubmit(form: any) {
    if (form.invalid) {
      return;
    }
    if (this.choices.length < 2) {
      this.invalidChoices = true
      return;
    }

    if (form.value.title.length < 5) {
      this.invalidTitle = true;
      return;
    }

    if (form.value.prompt.length < 5) {
      this.invalidPrompt = true;
      return;
    }

    if (form.value.rankLimit < 3) {
      form.value.rankLimit = 2;
    }
    let choicesObj = []
    for (let i = 0; i < this.choices.length; i++){
      let newChoice = {
        choice: this.choices[i],
        rankCount: new Array(form.value.rankLimit).fill(0)
      }
      choicesObj.push(newChoice)
    }
    form.value.choices = choicesObj
    form.value.createdBy = this.currUserId
    form.value.createdAt = new Date().toLocaleString();
    form.value.submissions = 0
    this.addRank(form.value);
    this.router.navigate(['trending']);
    let snackBarRef = this.snackBar.open("Ranking successfully added!", "Dismiss", {
      duration: 3000
    })
    form.resetForm();
    this.choices = []
  }

  addRank(values: any) {
    const dbInstance = collection(this.firestore, 'rankings');
    addDoc(dbInstance, values).then((res) => {
    }).catch((err) => {
      console.log(err)
    })
  }

  add(event: MatChipInputEvent) {
    this.invalidChoices = false;
    const value = (event.value || '').trim();

    //Add our choice
    if (value) {
      if (this.choices.length >= 2) {
        this.sliderLength++;
      }
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

  formatLabel(value: number) {
    return value;
  }
}
