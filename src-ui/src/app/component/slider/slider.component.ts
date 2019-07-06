import { OnInit } from '@angular/core';
import {Component,  Output, EventEmitter, ViewChild, ElementRef, Input, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'slider',
    templateUrl: 'slider.component.html',
    styleUrls: ['slider.component.css']
})
export class SliderComponent implements OnInit {
    @Input() startValue: number = 0;
    @Input() updateOnDrag: boolean = false;
    @Output() public positionChanged: EventEmitter<number> = new EventEmitter();
    public markerPos: number = 0;
    private dragging: boolean = false;

    @ViewChild('slider',  {static: false}) private sliderElement: ElementRef;

    constructor(@Inject(DOCUMENT) private documentRef: any) {}

    public ngOnInit(): void {
        this.markerPos = this.startValue;
    }

    public onClick(event: MouseEvent): void {
        this.updatePosition(event.offsetX, true);
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.dragging) {
            this.updatePosition(event.pageX - this.sliderElement.nativeElement.getBoundingClientRect().left, this.updateOnDrag);
            event.preventDefault();
        }
    }

    public onMouseDown(event: MouseEvent): void {
        this.dragging = true;
        this.updatePosition(event.offsetX, this.updateOnDrag);
        let mouseMoveListener = (wEvent: MouseEvent) => this.onMouseMove(wEvent);
        let mouseUpListener = (wEvent: MouseEvent) => {
            this.positionChanged.emit(this.markerPos / 100);
            this.dragging = false;
            this.documentRef.removeEventListener('mousemove', mouseMoveListener);
            this.documentRef.removeEventListener('mouseup', mouseUpListener);
        };
        this.documentRef.addEventListener('mousemove', mouseMoveListener);
        this.documentRef.addEventListener('mouseup', mouseUpListener);
    }

    public setPosition(newPosition: number): void {
        if (!this.dragging) {
            this.markerPos = newPosition;
        }
    }

    private updatePosition(offset: number, emitEvent: boolean): void {
        let newPosition: number = (offset / this.sliderElement.nativeElement.offsetWidth);
        newPosition = Math.max(Math.min(newPosition, 1), 0);
        this.markerPos = newPosition * 100;
        if (emitEvent) {
            this.positionChanged.emit(newPosition);
        }
    }
}
