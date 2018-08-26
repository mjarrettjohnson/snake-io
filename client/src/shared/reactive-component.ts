import { Observable } from 'rxjs';
import { ReactiveModel, Pipe, DistinctUntilChanged, DebounceTime, ShareReplay } from 'rxjs-decorators';
import { FormGroup } from '@angular/forms';

export const CONTROL_METADATA = 'Control Metadata';
export const MODEL_METADATA = 'Model Metadata';

export interface Listeners {
  [key: string]: Observable<any>;
}

export const FormControl = (target: object, key: string) => {
  const metadata = Reflect.getMetadata(CONTROL_METADATA, target) || ({});
  metadata[key] = key;

  Reflect.defineMetadata(CONTROL_METADATA, metadata, target);
};

export const formModel = (target: object, key: string) => {

  Reflect.defineMetadata(MODEL_METADATA, key, target);
};


export const FormModel = Pipe([
  ShareReplay(1),
  formModel
]);


export class ReactiveComponent<T> extends ReactiveModel {

  private metadata;

  protected get modelValue(): Observable<T> {
    return this.formModel.valueChanges;
  }

  protected get listeners(): Listeners {
    const listeners: Listeners = {};
    for (const control in this.formModel.controls) {
      listeners[control] = this.formModel.get(control).valueChanges;
    }
    return listeners;
  }

  constructor(protected formModel: FormGroup) {
    super();
  }

  start() {
    Object.keys(this.listeners).forEach(this.setProperties);

    const propNames = Object.keys(this.listeners).map(t => t);
    const model = Reflect.getMetadata(MODEL_METADATA, this);

    if (!model) {
      throw new Error('No Model Set');
    } else {
      this[model] = this.formModel.valueChanges;
    }

    this.initialize();

    this.subscribe();
  }


  private subscribe() {
    for (const control in this.formModel.controls) {
      const obs: Observable<any> = this[control];

      if (obs) {
        this.subscriptions.push((obs).subscribe(value => {
          this.formModel.get(control).patchValue(value, { emitEvent: false });
        }));
      }
    }
  }

  private doesControlExists(controlName: string): boolean {
    if (!this.metadata) {
      const metadata = Reflect.getMetadata(CONTROL_METADATA, this);
      if (!metadata) {
        return false;
      } else {
        this.metadata = metadata;
      }
    }

    return !!this.metadata[controlName];
  }


  private setProperties = (propName: string) => {
    if (!this.doesControlExists(propName)) {
      console.log(`property ${propName} does not exist on component`);
      return;
    }

    this[propName] = this.listeners[propName];
  }
}
