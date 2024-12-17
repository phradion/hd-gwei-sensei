import { spawn } from 'child_process';
import path from 'path';

// Define types for the prediction response
interface TimeOffset {
  value: number;
  unit: 'minute' | 'hour';
}

interface GasFee {
    value: number;
    unit: string; //i.e. gwei
}

interface Prediction {
  offset: TimeOffset;
  gas_fee: GasFee;
  confidence: 'low' | 'medium' | 'high';
}

interface BestOption extends Prediction {
  reason: string;
}

interface PredictionResponse {
  predictions: Prediction[];
  best_option: BestOption;
  metadata: {
    currency_unit: string;
    prediction_time: string;
    model_version: string;
  };
}

// Function to call the Python script and get predictions
function getGasFeePredictions(inputData: object = {}): Promise<PredictionResponse> {
  return new Promise((resolve, reject) => {
    // Path to the Python script inside the "models" folder
    const scriptPath = path.join(__dirname, 'models', 'mock_model.py');

    // Spawn a Python process
    const pythonProcess = spawn('python3', [scriptPath]);

    let result = '';
    let error = '';

    // Send input data (JSON) to the Python script
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    // Capture the output
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture any errors
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process close
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script failed with code ${code}: ${error}`);
      } else {
        try {
          const predictions: PredictionResponse = JSON.parse(result);
          resolve(predictions);
        } catch (parseError) {
          reject(`Error parsing JSON: ${parseError}`);
        }
      }
    });
  });
}

// Example usage with TypeScript type safety
(async () => {
  try {
    console.log('Fetching gas fee predictions...');
    const input = { hours: 1 }; // Example input
    const predictions = await getGasFeePredictions(input);

    console.log('Gas Fee Predictions:');
    console.log(JSON.stringify(predictions, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
})();