import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Explicitly set as dynamic route
export const dynamic = 'force-dynamic';

// Path to store enquiries data
const dataFilePath = path.join(process.cwd(), 'data', 'enquiries.json');

// Helper function to ensure data file exists
function ensureDataFileExists() {
  try {
    const dir = path.dirname(dataFilePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
    
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
      console.log(`Created file: ${dataFilePath}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring data file exists:', error);
    return false;
  }
}

//  function to read enquiries
function readEnquiries() {
  try {
    ensureDataFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading enquiries:', error);
    return [];
  }
}

// Helper function to write enquiries to file
function writeEnquiries(enquiries) {
  try {
    ensureDataFileExists();
    fs.writeFileSync(dataFilePath, JSON.stringify(enquiries, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing enquiries:', error);
    return false;
  }
}

// GET handler to retrieve all enquiries
export async function GET() {
  try {
    console.log('GET request received for enquiries');
    const enquiries = readEnquiries();
    console.log(`Retrieved ${enquiries.length} enquiries`);
    
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error reading enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve enquiries' },
      { status: 500 }
    );
  }
}

// POST handler to create a new enquiry
export async function POST(request) {
  try {
    console.log('POST request received');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate the required fields
    if (!body.name || !body.email || !body.service || !body.message) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, service, and message are required fields' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Read existing enquiries
    const enquiries = readEnquiries();
    
    // Create new enquiry with timestamp
    const newEnquiry = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      service: body.service,
      message: body.message,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    console.log('New enquiry object:', newEnquiry);
    
    // Add to array and save to file
    enquiries.push(newEnquiry);
    writeEnquiries(enquiries);
    
    console.log(`Added enquiry to file. Total enquiries: ${enquiries.length}`);
    
    return NextResponse.json(newEnquiry, { status: 201 });
    
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
} 