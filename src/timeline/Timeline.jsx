import './Timeline.css'

function ClockLine() {
    return (
        <div className="timeline">
            <div className="timeline__mark">8:00</div>
            <div className="timeline__mark">9</div>
            <div className="timeline__mark">10</div>
            <div className="timeline__mark">11</div>
            <div className="timeline__mark">12</div>
            <div className="timeline__mark">13</div>
            <div className="timeline__mark">14</div>
            <div className="timeline__mark">15</div>
            <div className="timeline__mark">16</div>
            <div className="timeline__mark">17</div>
            <div className="timeline__mark">18</div>
            <div className="timeline__mark">19</div>
            <div className="timeline__mark">20</div>
            <div className="timeline__mark">21</div>
            <div className="timeline__mark">22</div>
            <div className="timeline__mark">23</div>
            <div className="timeline__mark timeline__mark--current-time">22:12</div>
        </div>
    )
}

export default ClockLine