import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function logInputsBatchToSupabase(tab, rowDataObj) {
  const rowID = localStorage.getItem('rowID') || "0"; // get rowID from localStorage

  const insertObj = {
    [tab]: rowDataObj
  };

  // Use insertObj only if tab defined, else use rowDataObj directly
  const finalObj = tab ? insertObj : rowDataObj;

  let data, error;
  if (rowID === "0") {
    // Insert new record
    ({ data, error } = await supabase
      .from('Inputs')
      .insert([finalObj])
      .select());
  } else {
    // Update existing record by id
    ({ data, error } = await supabase
      .from('Inputs')
      .update(finalObj)
      .eq('id', Number(rowID)));
  }

  if (error) {
    console.error('Supabase error:', error.message);
  } else {
    // On successful insert, update rowID with new id for future updates
    if (rowID === "0" && data && data.length > 0) {
      localStorage.setItem('rowID', data[0].id.toString());
    }
  }

}


