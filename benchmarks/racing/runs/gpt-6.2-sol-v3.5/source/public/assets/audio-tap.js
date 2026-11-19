class MasterTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.active = false;
    this.samples = new Int16Array(16384);
    this.index = 0;
    this.peak = 0;
    this.port.onmessage = ({ data }) => {
      if (data === 'start') {
        this.active = true;
        this.index = 0;
        this.peak = 0;
      } else if (data === 'stop' && this.active) {
        this.active = false;
        this.send();
        this.port.postMessage({ done:true, peak:this.peak });
      }
    };
  }

  send() {
    if (!this.index) return;
    const chunk = this.samples.slice(0, this.index);
    this.port.postMessage({ chunk }, [chunk.buffer]);
    this.index = 0;
  }

  process(inputs, outputs) {
    if (!this.active || !inputs[0]?.length) return true;
    const [left, right = left] = inputs[0];
    for (let i = 0; i < left.length; i++) {
      for (const value of [left[i], right[i]]) {
        this.peak = Math.max(this.peak, Math.abs(value));
        this.samples[this.index++] = Math.round(Math.max(-1,Math.min(1,value))*32767);
      }
      if (this.index === this.samples.length) this.send();
    }
    outputs[0]?.forEach(channel=>channel.fill(0));
    return true;
  }
}

registerProcessor('master-tap', MasterTap);
