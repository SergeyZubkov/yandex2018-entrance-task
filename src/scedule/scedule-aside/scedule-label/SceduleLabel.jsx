import "./SceduleLabel.css";

function SceduleLabel({ title, subtitle }) {
  return (
    <div className="scedule__label">
      <div className="scedule__label-title">{title}</div>
      <div className="scedule__label-subtitle">{`до ${subtitle} человек`}</div>
    </div>
  );
}

export default SceduleLabel;
