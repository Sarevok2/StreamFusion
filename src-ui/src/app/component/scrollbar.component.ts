import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'scrollbar',
  templateUrl: 'scrollbar.component.html'
})
export class ScrollbarComponent{
	public showVertical: boolean = true;
	public showHorizontal: boolean = false;
	public verticalMarkerTop: string = '0px';
	public verticalMarkerHeight: string = '0px';
    public horizontalMarkerLeft: string = '0px';
    public horizontalMarkerWidth: string = '0px';
	@Input() public enableVerticalScrollbar: boolean = true;
	@Input() public enableHorizontalScrollbar: boolean = true;
    @ViewChild('scrollContainer') private scrollContainer: ElementRef;
    private isMouseOnElement: boolean = false;
    private isDraggingScrollbar: boolean = false;

    constructor(private el: ElementRef) {
        el.nativeElement.className += " scrollbar";
        this.showHorizontal = false;
        this.showVertical = false;
    }

	public updateSize(): void {
	    setTimeout(()=> {
            let scrollMarkerSize: number = Math.pow(this.scrollContainer.nativeElement.clientHeight, 2) / this.scrollContainer.nativeElement.scrollHeight - 2;
            this.verticalMarkerHeight = scrollMarkerSize + 'px';
            scrollMarkerSize = Math.pow(this.scrollContainer.nativeElement.clientWidth, 2) / this.scrollContainer.nativeElement.scrollWidth - 2;
            this.horizontalMarkerWidth = scrollMarkerSize + 'px';
            this.updateScrollMarkerStart();
            this.updateScrollbarVisibility();
        }, 0);
    }

    @HostListener("wheel", ['$event'])
	private onWindowScroll(event: WheelEvent) {
		this.scrollContainer.nativeElement.scrollTop -= (event.wheelDeltaY / 2);
        this.updateScrollMarkerStart();
        event.stopPropagation();
	}

    @HostListener("mouseenter")
    private onMouseEnter() {
        this.isMouseOnElement = true;
        this.updateScrollbarVisibility();
    }

    @HostListener("mouseleave")
    private onMouseLeave() {
        this.isMouseOnElement = false;
        this.updateScrollbarVisibility();
    }

    public onVertMarkerMouseDown(event: MouseEvent, isVert: boolean): void {
        const scrollEl: any = this.scrollContainer.nativeElement;
        const mouseStart: number = isVert ? event.clientY : event.clientX;
        const scrollStart: number = isVert ? scrollEl.scrollTop : scrollEl.scrollLeft;
        this.isDraggingScrollbar = true;
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
            this.isDraggingScrollbar = false;
            this.showVertical = this.enableVerticalScrollbar && this.isMouseOnElement;
            this.showHorizontal = this.enableHorizontalScrollbar && this.isMouseOnElement;
            document.removeEventListener("mousemove", moveHandler);
        })
    }

	private updateScrollMarkerStart(): void {
        let scrollMarkerStart: number = this.scrollContainer.nativeElement.clientHeight * this.scrollContainer.nativeElement.scrollTop / this.scrollContainer.nativeElement.scrollHeight + 1;
        this.verticalMarkerTop = scrollMarkerStart + 'px';
        scrollMarkerStart = this.scrollContainer.nativeElement.clientWidth * this.scrollContainer.nativeElement.scrollLeft / this.scrollContainer.nativeElement.scrollWidth + 1;
        this.horizontalMarkerLeft = scrollMarkerStart + 'px';
    }

    private updateScrollbarVisibility(): void {
        if (this.isMouseOnElement) {
            this.showVertical = this.enableVerticalScrollbar && (this.scrollContainer.nativeElement.scrollHeight > this.scrollContainer.nativeElement.clientHeight);
            this.showHorizontal = this.enableHorizontalScrollbar && (this.scrollContainer.nativeElement.scrollWidth > this.scrollContainer.nativeElement.clientWidth);
        } else {
            this.showVertical = this.enableVerticalScrollbar && this.isDraggingScrollbar;
            this.showHorizontal = this.enableHorizontalScrollbar && this.isDraggingScrollbar;
        }
    }
}
