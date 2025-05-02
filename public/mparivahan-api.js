
// Mock mParivahan API implementation for development purposes
window.mParivahanAPI = {
  // Fetch license details by license number
  fetchLicenseDetails: async (licenseNumber) => {
    console.log('Fetching license details for:', licenseNumber);
    // Return mock data for development
    return {
      success: true,
      data: {
        name: 'Demo User',
        licenseNumber: licenseNumber,
        validFrom: '2020-01-01',
        validTo: '2030-01-01',
        vehicleClass: 'LMV',
        authority: 'RTO Delhi',
      }
    };
  },
  
  // Fetch vehicle details by registration number
  fetchVehicleDetails: async (registrationNumber) => {
    console.log('Fetching vehicle details for:', registrationNumber);
    // Return mock data for development
    return {
      success: true,
      data: {
        registrationNumber: registrationNumber,
        ownerName: 'Demo User',
        vehicleClass: 'LMV',
        fuelType: 'Petrol',
        manufacturer: 'Demo Manufacturer',
        model: 'Demo Model',
        registeredDate: '2020-01-01',
      }
    };
  }
};

console.log('mParivahan API mock loaded');
