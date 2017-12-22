import {Component, ElementRef, HostListener, Input, ViewChild, OnInit} from '@angular/core';

@Component({
  selector: 'scrollbar',
  templateUrl: 'scrollbar.component.html'
})
export class ScrollbarComponent implements OnInit {
	public showVertical: boolean = true;
	public showHorizontal: boolean = false;
	public verticalMarkerTop: string = '0px';
	public verticalMarkerHeight: string = '0px';
    public horizontalMarkerLeft: string = '0px';
    public horizontalMarkerWidth: string = '0px';
	@Input() public enableVerticalScrollbar: boolean = true;
	@Input() public enableHorizontalScrollbar: boolean = true;
    @ViewChild('scrollContainer') private scrollContainer: ElementRef;

    constructor(private el: ElementRef) {
        el.nativeElement.className += " scrollbar";
        this.showHorizontal = false;
        this.showVertical = false;
    }
    public ngOnInit(): void {
        //this.updateSize();
    }

	public updateSize(): void {
	    setTimeout(()=> {
            let scrollMarkerSize: number = Math.pow(this.scrollContainer.nativeElement.clientHeight, 2) / this.scrollContainer.nativeElement.scrollHeight - 2;
            this.verticalMarkerHeight = scrollMarkerSize + 'px';
            scrollMarkerSize = Math.pow(this.scrollContainer.nativeElement.clientWidth, 2) / this.scrollContainer.nativeElement.scrollWidth - 2;
            this.horizontalMarkerWidth = scrollMarkerSize + 'px';
            this.updateScrollMarkerStart();
        }, 0);
    }

    @HostListener("wheel", ['$event'])
	private onWindowScroll(event: WheelEvent) {
		this.scrollContainer.nativeElement.scrollTop -= (event.wheelDeltaY / 5);
        this.updateScrollMarkerStart();
        event.stopPropagation();
	}

    @HostListener("mouseenter")
    private onMouseEnter() {
        this.showVertical = this.enableVerticalScrollbar && (this.scrollContainer.nativeElement.scrollHeight > this.scrollContainer.nativeElement.clientHeight);
        this.showHorizontal = this.enableHorizontalScrollbar && (this.scrollContainer.nativeElement.scrollWidth > this.scrollContainer.nativeElement.clientWidth);
    }

    @HostListener("mouseleave")
    private onMouseLeave() {
        this.showVertical = false;
        this.showHorizontal = false;
    }

    public onVertMarkerMouseDown(event: MouseEvent, isVert: boolean): void {
        const scrollEl: any = this.scrollContainer.nativeElement;
        const mouseStart: number = isVert ? event.clientY : event.clientX;
        const scrollStart: number = isVert ? scrollEl.scrollTop : scrollEl.scrollLeft;
        const moveHandler = (event: MouseEvent) => {
            if (isVert) {
                scrollEl.scrollTop = ((event.clientY - mouseStart)/ scrollEl.clientHeight*scrollEl.scrollHeight) + scrollStart;
            } else {
                scrollEl.scrollLeft = ((event.clientX - mouseStart)/ scrollEl.clientWidth*scrollEl.scrollWidth) + scrollStart;
            }
            this.updateScrollMarkerStart();
            event.preventDefault();
        };
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", moveHandler);
        })
    }

	private updateScrollMarkerStart(): void {
        let scrollMarkerStart: number = this.scrollContainer.nativeElement.clientHeight * this.scrollContainer.nativeElement.scrollTop / this.scrollContainer.nativeElement.scrollHeight + 1;
        this.verticalMarkerTop = scrollMarkerStart + 'px';
        scrollMarkerStart = this.scrollContainer.nativeElement.clientWidth * this.scrollContainer.nativeElement.scrollLeft / this.scrollContainer.nativeElement.scrollWidth + 1;
        this.horizontalMarkerLeft = scrollMarkerStart + 'px';
    }
}
