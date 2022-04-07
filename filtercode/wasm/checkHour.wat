(module
 (type $none_=>_none (func))
 (type $none_=>_f64 (func (result f64)))
 (import "checkHour" "currentHour" (func $filtercode/assemblyscript/checkHour/currentHour (result f64)))
 (import "checkHour" "sendSMS" (func $filtercode/assemblyscript/checkHour/sendSMS))
 (import "checkHour" "skipAction" (func $filtercode/assemblyscript/checkHour/skipAction))
 (memory $0 0)
 (export "filterCode" (func $filtercode/assemblyscript/checkHour/filterCode))
 (export "memory" (memory $0))
 (export "_start" (func $~start))
 (func $filtercode/assemblyscript/checkHour/filterCode
  call $filtercode/assemblyscript/checkHour/currentHour
  f64.const 13
  f64.eq
  if
   call $filtercode/assemblyscript/checkHour/sendSMS
  else
   call $filtercode/assemblyscript/checkHour/skipAction
  end
 )
 (func $~start
  nop
 )
)
