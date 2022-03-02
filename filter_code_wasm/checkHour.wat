(module
 (type $none_=>_none (func))
 (type $none_=>_f64 (func (result f64)))
 (import "checkHour" "currentHour" (func $filter_code_assemblyscript/checkHour/currentHour (result f64)))
 (import "checkHour" "sendSMS" (func $filter_code_assemblyscript/checkHour/sendSMS (result f64)))
 (import "checkHour" "skipAction" (func $filter_code_assemblyscript/checkHour/skipAction))
 (memory $0 0)
 (export "filterCode" (func $filter_code_assemblyscript/checkHour/filterCode))
 (export "memory" (memory $0))
 (export "_start" (func $~start))
 (func $filter_code_assemblyscript/checkHour/filterCode
  call $filter_code_assemblyscript/checkHour/currentHour
  f64.const 13
  f64.eq
  if
   call $filter_code_assemblyscript/checkHour/sendSMS
   drop
  else
   call $filter_code_assemblyscript/checkHour/skipAction
  end
 )
 (func $~start
  nop
 )
)
